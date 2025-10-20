import { useState, useEffect } from "react";
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
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import emailjs from "emailjs-com";

const formSchema = z.object({
  name: z.string().trim().min(5, "El nombre debe tener al menos 5 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().min(9, "El teléfono debe tener al menos 9 dígitos").max(20),
  address: z.string().trim().min(5, "La dirección debe tener al menos 5 caracteres").max(200, "La dirección es demasiado larga"),
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
  const [calculatedTotal, setCalculatedTotal] = useState(0);

  useEffect(() => {
    const newTotal = selectedProducts.reduce((sum, product) => {
      const price = typeof product.price === "number" 
        ? product.price 
        : parseFloat(product.price.replace(/[^0-9.-]+/g, "")) || 0;
      return sum + (price * product.quantity);
    }, 0);
    setCalculatedTotal(newTotal);
  }, [selectedProducts]);

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
      .map((p) => `${p.name} x${p.quantity} - $${(p.price * p.quantity).toLocaleString('es-CL')}`)
      .join("\n");

    const templateParams = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      pickupDate: format(values.pickupDate, "PPP", { locale: es }),
      notes: values.notes || "Ninguna",
      products_list: productsList,
      total: calculatedTotal.toLocaleString('es-CL'),
    };

    try {
      await emailjs.send(
        "service_xu53kvi",
        "template_vuk464n",
        templateParams,
        "A5mXmcvyWpgUORjL2"
      );

      toast.success("¡Pedido agendado exitosamente!", {
        description: `Fecha de entrega: ${format(values.pickupDate, "PPP", { locale: es })}`,
      });
      
      form.reset();
    } catch (error) {
      console.error("Error al enviar el email:", error);
      toast.error("Error al enviar el pedido. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = addDays(new Date(), 2);

  return (
    <section id="pedidos" className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Agenda tu Pedido
          </h2>
          <p className="text-lg text-muted-foreground">
            Selecciona tus dulces favoritos y agenda con 48 horas de anticipación
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Productos Seleccionados</CardTitle>
            {selectedProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No has seleccionado ningún producto. Agrega productos desde el catálogo.
              </p>
            ) : (
              <div className="space-y-4 mt-4">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card p-4 rounded-lg shadow-md flex items-center justify-between gap-4"
                  >
                    <span className="font-medium flex-1">{product.name}</span>
                    <span className="flex-1 text-center">{product.quantity}</span>
                    <span className="flex-1 text-muted-foreground text-center">${product.price.toLocaleString('es-CL')}</span>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-semibold text-primary">
                        ${(product.price * product.quantity).toLocaleString('es-CL')}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, 0)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        title="Eliminar"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary/20 mt-4">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-3xl font-bold text-primary">
                    ${calculatedTotal.toLocaleString('es-CL')}
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
                        <Input placeholder="Nombre y Apellido" {...field} />
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
                          placeholder="Calle, número, ciudad..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ✅ CALENDARIO CON FONDO AMARILLO CLARO */}
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
                                !field.value && "text-muted-foreground"
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
                        <PopoverContent 
                          className="w-auto p-3 bg-yellow-50 border border-yellow-200 rounded-md shadow-lg"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < minDate}
                            initialFocus
                            locale={es}
                            className="bg-yellow-50"
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
                  className="w-full text-lg"
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