import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Clock, Instagram, Mail, MessageCircle } from "lucide-react";
import ProductCatalog from "@/components/ProductCatalog";
import OrderForm from "@/components/OrderForm";
import logo from "@/assets/logo_dulces.png";

const Index = () => {
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});

  // Product prices in Chilean pesos, with variants for Candy Bar Personalizado
  const productPrices: Record<string, Record<number, number>> = {
    "1": { 0: 2500 },
    "2": { 0: 1000 },
    "3": { 0: 1300 },
    "4": { 0: 5000 },
    "5": { 0: 20000 },
    "6": { 0: 700 },
    "7": { 30: 42000, 60: 78000, 90: 96000 },
    "8": { 0: 800 },
  };

  const handleUpdateQuantity = (id: string, name: string, quantity: number, variant?: number) => {
    const selectedQuantity = variant || quantity; // Use variant for Candy Bar, otherwise use quantity
    setProductQuantities((prev) => ({
      ...prev,
      [id]: selectedQuantity,
    }));
    console.log(`Updated ${name} to quantity: ${selectedQuantity}`); // Debug log
  };

  const handleRemoveFromOrder = (id: string) => {
    setProductQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[id];
      return newQuantities;
    });
  };

  const selectedProducts = Object.entries(productQuantities)
    .filter(([_, quantity]) => quantity > 0)
    .map(([id, quantity]) => {
      const productNames: Record<string, string> = {
        "1": "Paletas Grandes",
        "2": "Alfajores de Coctel",
        "3": "Cake Pops",
        "4": "Barras de Chocolate Personalizados",
        "5": "Pack de Galletas Casita",
        "6": "Mini Paletas",
        "7": "Candy Bar Personalizado",
        "8": "Paletas Temáticas",
      };
      const priceKey = Object.keys(productPrices[id]).find((k) => parseInt(k) === quantity) || "0";
      const basePrice = productPrices[id][parseInt(priceKey)] || 0;
      return {
        id,
        name: productNames[id],
        quantity: id === "7" ? quantity : quantity, // For Candy Bar, use the selected quantity as the variant
        price: id === "7" ? basePrice : basePrice, // For Candy Bar, price is the total
      };
    });

  const total = selectedProducts.reduce((sum, product) => sum + product.price, 0);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1518640467707-6811f43a7bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/70" />
        
        <nav className="relative z-10 container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Dulce Encanto Logo" className="w-16 h-16 md:w-20 md:h-20" />
            <span className="text-2xl font-bold text-primary-foreground">Dulces Fiestas</span>
          </div>
          <div className="hidden md:flex gap-6">
            <button
              onClick={() => scrollToSection("productos")}
              className="text-primary-foreground hover:text-accent transition-colors font-medium"
            >
              Productos
            </button>
            <button
              onClick={() => scrollToSection("sobre-nosotros")}
              className="text-primary-foreground hover:text-accent transition-colors font-medium"
            >
              Sobre Nosotros
            </button>
            <button
              onClick={() => scrollToSection("pedidos")}
              className="text-primary-foreground hover:text-accent transition-colors font-medium"
            >
              Pedidos
            </button>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary-foreground mb-6 leading-tight">
              Endulza tus Momentos
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              Haz tus pedidos personalizados y celebra con dulzura junto a Dulces Fiestas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => scrollToSection("productos")}
                className="text-lg shadow-lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Ver Catálogo
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("pedidos")}
                className="text-lg bg-white/10 hover:bg-white/20 text-primary-foreground border-primary-foreground/30"
              >
                <Clock className="mr-2 h-5 w-5" />
                Hacer Pedido
              </Button>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative z-10">
          <svg
            className="w-full h-16 md:h-24"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </header>

      {/* Catalog Section */}
      <ProductCatalog productQuantities={productQuantities} onUpdateQuantity={handleUpdateQuantity} />

      {/* About Us Section */}
      <section
        id="sobre-nosotros"
        className="py-16 px-4 md:px-6 lg:px-8 bg-purple-100"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Sobre Dulces Fiestas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              En Dulces Fiestas transformamos cada celebración en un momento inolvidable.
              Nos dedicamos a crear y personalizar deliciosos productos a tu gusto, con todo el cariño y detalle que mereces
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center items-center">
              <img
                src={logo}
                alt="Dulces Fiestas Logo"
                className="w-40 h-40 md:w-64 md:h-64 object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Trabajamos con chocolate, diseño de tortas, cake pops, alfajores y mucho más.
                Cada creación es única, pensada especialmente para sorprender y endulzar tus eventos
              </p>
              <p className="text-muted-foreground">
                Nuestra misión es hacer que cada bocado sea una experiencia inolvidable. ¡Explora nuestro catálogo y déjanos ser parte de tus momentos especiales!
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => scrollToSection("productos")}
                className="text-lg shadow-lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Descubre Nuestros Dulces
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <OrderForm selectedProducts={selectedProducts} onUpdateQuantity={handleRemoveFromOrder} total={total} />

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/+56995425454?text=Hola,%20quiero%20hacer%20un%20pedido%20en%20Dulces%20Fiestas"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-colors z-50"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="h-8 w-8" />
      </a>

      {/* Footer */}
      <footer className="bg-card py-8 px-4 border-t">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="Dulce Encanto Logo" className="w-10 h-10" />
            <span className="text-xl font-bold">Dulces Fiestas</span>
          </div>
          <p className="text-muted-foreground mb-4">
            © 2025 Dulces Fiestas. Los mejores dulces artesanales a tu alcance.
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="mailto:pamedulcesfiestas@gmail.com"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-5 w-5" />
              pamedulcesfiestas@gmail.com
            </a>
            <a
              href="https://www.instagram.com/_dulcesfiestas_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
              @_dulcesfiestas_
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;