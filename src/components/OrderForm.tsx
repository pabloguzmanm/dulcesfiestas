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
  let newTotal = 0;
  for (const product of selectedProducts) {
    if (product.id === "7") {
      // Candy Bar: usar precio directamente
      newTotal += product.price;
    } else {
      // Otros: precio unitario × cantidad
      newTotal += product.price * product.quantity;
    }
  }
  setCalculatedTotal(newTotal);
  console.log("Cálculo en OrderForm:", selectedProducts, "→ Total:", newTotal);
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
      .map((p) => {
        const linePrice = p.id === "7"
          ? p.price
          : p.price * p.quantity;
        const quantityText = p.id === "7" ? `(${p.quantity} unidades)` : `x${p.quantity}`;
        return `${p.name} ${quantityText} - $${linePrice.toLocaleString('es-CL')}`;
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
    <section 
      id="pedidos" 
      className="py-16 px-4 md:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, #fdf2f8, #f3e8ff, #fff9e6)`,
        backgroundImage: `
          radial-gradient(circle at 10% 20%, #FF6F61 1.5px, transparent 2px),
          radial-gradient(circle at 90% 30%, #6ECEDA 1.5px, transparent 2px),
          radial-gradient(circle at 30% 80%, #FFD166 1.5px, transparent 2px),
          radial-gradient(circle at 70% 70%, #A06CD5 1.5px, transparent 2px)
        `,
        backgroundSize: '80px 80px',
      }}
    >
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 bg-clip-text text-transparent">
            Agenda tu Pedido
          </h2>
          <p className="text-lg text-muted-foreground">
            Selecciona tus dulces favoritos y agenda con 48 horas de anticipación
          </p>
        </div>

        {/* ✅ Card con fondo rosado sólido */}
        <Card className="shadow-xl bg-pink-50 border-pink-200">
          <CardHeader>
            <CardTitle className="text-pink-700">Productos Seleccionados</CardTitle>
            {selectedProducts.length === 0 ? (
              <p className="text-sm text-pink-600">
                No has seleccionado ningún producto. Agrega productos desde el catálogo.
              </p>
            ) : (
              <div className="space-y-4 mt-4">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between gap-4 border border-pink-200"
                  >
                    <span className="font-medium flex-1 text-pink-800">{product.name}</span>
                    <span className="flex-1 text-center text-pink-700">{product.quantity}</span>
                    <span className="flex-1 text-pink-600 text-center">${product.price.toLocaleString('es-CL')}</span>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-semibold text-pink-700">
                        {product.id === "7"
                          ? `$${product.price.toLocaleString('es-CL')}`
                          : `$${(product.price * product.quantity).toLocaleString('es-CL')}`}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, 0)}
                        className="text-pink-500 hover:text-pink-700 transition-colors"
                        title="Eliminar"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="flex items-center justify-between p-4 bg-pink-100 rounded-lg border-2 border-pink-300 mt-4">
                  <span className="text-xl font-bold text-pink-800">Total:</span>
                  <span className="text-3xl font-bold text-pink-700">
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
                      <FormLabel className="text-pink-700">Nombre Completo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nombre y Apellido" 
                          {...field} 
                          className="bg-white border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                        />
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
                      <FormLabel className="text-pink-700">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="correo@ejemplo.com" 
                          {...field} 
                          className="bg-white border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                        />
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
                      <FormLabel className="text-pink-700">Teléfono</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="912345678" 
                          {...field} 
                          className="bg-white border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                        />
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
                      <FormLabel className="text-pink-700">Dirección de Envío</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Calle, número, ciudad..."
                          className="resize-none bg-white border-pink-300 focus:border-pink-500 focus:ring-pink-500"
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
                      <FormLabel className="text-pink-700">Fecha de Entrega (mínimo 48 horas)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-white border-pink-300 text-pink-700 hover:bg-pink-100",
                                !field.value && "text-pink-500"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 text-pink-500" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-auto p-3 bg-pink-50 border border-pink-200 rounded-md shadow-lg"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < minDate}
                            initialFocus
                            locale={es}
                            className="bg-white"
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
                      <FormLabel className="text-pink-700">Notas Adicionales (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Especifica cantidades, preferencias o instrucciones especiales..."
                          className="resize-none bg-white border-pink-300 focus:border-pink-500 focus:ring-pink-500"
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
                  className="w-full text-lg bg-pink-600 hover:bg-pink-700 text-white"
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