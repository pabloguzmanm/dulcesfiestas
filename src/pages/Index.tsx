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
  {/* Imagen de fondo temática */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url(https://images.unsplash.com/photo-1518640467707-6811f43a7bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)` }}
  />
  {/* Overlay degradado para contraste y color */}
  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/80 via-purple-600/70 to-yellow-400/60" />

  {/* Navbar */}
  <nav className="relative z-20 py-4 px-4 md:px-6 flex justify-between items-center max-w-7xl mx-auto">
    <div className="flex items-center gap-3">
      <div className="bg-white/20 backdrop-blur-sm p-1 rounded-full border border-white/30">
        <img src={logo} alt="Dulces Fiestas Logo" className="w-14 h-14 md:w-16 md:h-16 drop-shadow-sm" />
      </div>
      <span className="text-2xl font-bold text-white drop-shadow-md">
        Dulces Fiestas
      </span>
    </div>

    <div className="hidden md:flex gap-6">
      {[
        { label: "Productos", id: "productos" },
        { label: "Sobre Nosotros", id: "sobre-nosotros" },
        { label: "Pedidos", id: "pedidos" },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className="relative text-white font-medium px-2 py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full hover:text-yellow-100"
        >
          {item.label}
        </button>
      ))}
    </div>
  </nav>

  {/* Contenido principal del hero */}
  <div className="relative z-10 container mx-auto px-4 py-16 md:py-28">
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-white drop-shadow-lg">
        Endulza tus Momentos
      </h1>
      <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto px-2 drop-shadow-md">
        Haz tus pedidos personalizados y celebra con dulzura junto a{' '}
        <span className="font-semibold text-yellow-100">Dulces Fiestas</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          variant="default"
          onClick={() => scrollToSection("productos")}
          className="text-lg px-8 bg-white text-pink-700 font-bold shadow-lg hover:shadow-xl hover:bg-pink-50 transition-shadow"
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Ver Catálogo
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => scrollToSection("pedidos")}
          className="text-lg px-8 border-white text-white hover:bg-white/10 backdrop-blur-sm"
        >
          <Clock className="mr-2 h-5 w-5" />
          Hacer Pedido
        </Button>
      </div>
    </div>
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
<footer className="relative py-10 px-4 border-t overflow-hidden">
  {/* Fondo decorativo con "sprinkles" usando pseudo-elementos CSS en Tailwind (simulado con capas) */}
  <div 
    className="absolute inset-0 opacity-10"
    style={{
      backgroundImage: `
        radial-gradient(circle at 10% 20%, #FF6F61 2px, transparent 3px),
        radial-gradient(circle at 90% 30%, #6ECEDA 2px, transparent 3px),
        radial-gradient(circle at 30% 80%, #FFD166 2px, transparent 3px),
        radial-gradient(circle at 70% 70%, #06D6A0 2px, transparent 3px)
      `,
      backgroundSize: '60px 60px',
    }}
  />
  
  <div className="container mx-auto text-center relative z-10">
    <div className="flex items-center justify-center gap-3 mb-6">
      <img src={logo} alt="Dulce Encanto Logo" className="w-12 h-12 md:w-14 md:h-14 drop-shadow-md" />
      <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent">
        Dulces Fiestas
      </span>
    </div>
    
    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto px-2">
      © 2025 Dulces Fiestas. Los mejores dulces artesanales a tu alcance.  
      <span className="block mt-2 text-sm opacity-80">Hechos con amor, para tus momentos más dulces.</span>
    </p>
    
    <div className="flex flex-wrap justify-center gap-6">
      <a
        href="mailto:pamedulcesfiestas@gmail.com"
        className="group flex items-center gap-2 text-muted-foreground hover:text-pink-500 transition-colors duration-300"
      >
        <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
        pamedulcesfiestas@gmail.com
      </a>
      <a
        href="https://www.instagram.com/_dulcesfiestas_/"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 text-muted-foreground hover:text-pink-500 transition-colors duration-300"
      >
        <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
        @_dulcesfiestas_
      </a>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Index;