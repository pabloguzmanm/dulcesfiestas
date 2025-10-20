import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import emailjs from "emailjs-com";

const formSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().min(10, "Teléfono debe tener al menos 10 dígitos").max(20),
  address: z.string().trim().min(10, "La dirección debe tener al menos 10 caracteres").max(200, "La dirección es demasiado larga"),
  pickupDate: z.date({
    required_error: "Selecciona una fecha de entrega",
  }),
  notes: z.string().max(500).optional(),
});

interface OrderFormProps {
  selectedProducts: Array<{ id: string; name: string; quantity: number; price: number }>;
  onUpdateQuantity: (id: string, quantity: number) => void;
  total: number;
}

const OrderForm = ({ selectedProducts, onUpdateQuantity, total }: OrderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedProducts.length === 0) {
      toast.error("Por favor selecciona al menos un producto");
      return;
    }

    setIsSubmitting(true);

    const productsList = selectedProducts
      .map((p) => {
        const displayQuantity = p.id === "7" ? p.quantity : `${p.quantity} x`;
        const unitText = p.id === "7" ? (p.quantity === 1 ? "unidad" : "unidades") : "";
        return `${p.name} ${displayQuantity} ${unitText} - $${p.price.toLocaleString('es-CL')}`;
      })
      .join("\n");

    const templateParams = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      pickupDate: format(values.pickupDate, "PPP", { locale: es }),
      notes: values.notes || "Ninguna",
      products_list: productsList,
      total: total.toLocaleString('es-CL'),
    };

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const userId = process.env.REACT_APP_EMAILJS_USER_ID;

    console.log("Credenciales usadas:", { serviceId, templateId, userId });

    if (!serviceId || !templateId || !userId) {
      console.error("Faltan credenciales de EmailJS:", { serviceId, templateId, userId });
      toast.error("Error: Faltan configuraciones de email. Contacta al administrador.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await emailjs.send(serviceId, templateId, templateParams, userId);
      console.log("Email enviado:", response);
      toast.success("¡Pedido agendado exitosamente!", {
        description: `Fecha de entrega: ${format(values.pickupDate, "PPP", { locale: es })}`,
      });
      form.reset();
    } catch (error: any) {
      console.error("Error al enviar el email:", {
        message: error.message || "Sin mensaje",
        status: error.status || "Sin estado",
        text: error.text || "Sin texto",
        stack: error.stack || "Sin stack",
      });
      toast.error(`Error al enviar el pedido: ${error.message || 'Desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = addDays(new Date(), 2);

  return (
    <section id="pedidos" className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-sweet shadow-candy transition-smooth">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-candy bg-clip-text text-transparent transition-smooth">
            Agenda tu Pedido
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] transition-smooth">
            Selecciona tus dulces favoritos y agenda con 48 horas de anticipación
          </p>
        </div>

        <Card className="shadow-candy">
          <CardHeader>
            <CardTitle>Productos Seleccionados</CardTitle>
            {selectedProducts.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">
                No has seleccionado ningún producto. Agrega productos desde el catálogo.
              </p>
            ) : (
              <div className="space-y-3 mt-4">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-lg transition-smooth"
                  >
                    <div className="flex-1">
                      <span className="font-medium">{product.name}</span>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {product.id === "7" ? `${product.quantity} ${product.quantity === 1 ? "unidad" : "unidades"}` : `${product.quantity} x $${product.price.toLocaleString('es-CL')}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[var(--primary)]">
                        ${product.id === "7" ? product.price.toLocaleString('es-CL') : (product.price * product.quantity).toLocaleString('es-CL')}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, 0)}
                        className="text-[var(--destructive)] hover:text-[var(--destructive-foreground)] transition-smooth"
                        title="Eliminar"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between p-4 bg-[var(--primary)]/10 rounded-lg border-2 border-[var(--primary)]/20 mt-4 transition-smooth">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-3xl font-bold text-[var(--primary)]">
                    ${total.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="912345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección de Envío</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Calle, número, colonia, ciudad, código postal..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pickupDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Entrega (mínimo 48 horas)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-[var(--muted-foreground)]"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < minDate}
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas Adicionales (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Especifica cantidades, preferencias o instrucciones especiales..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 transition-smooth"
                  disabled={isSubmitting || selectedProducts.length === 0}
                >
                  {isSubmitting ? "Procesando..." : "Agendar Pedido"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OrderForm;