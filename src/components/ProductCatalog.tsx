import ProductCard from "./ProductCard";
import dulce1 from "@/assets/dulce1.png";
import dulce2 from "@/assets/dulce2.png";
import dulce3 from "@/assets/dulce3.png";
import dulce4 from "@/assets/dulce4.png";
import dulce5 from "@/assets/dulce5.png";
import dulce6 from "@/assets/dulce6.png";
import dulce7 from "@/assets/dulce7.png";
import dulce8 from "@/assets/dulce8.png";

interface ProductCatalogProps {
  productQuantities: Record<string, number>;
  onUpdateQuantity: (id: string, name: string, quantity: number, variant?: string) => void;
}

const products = [
  {
    id: "1",
    name: "Paletas Grandes",
    description: "Paletas personalizada de dos chocolates (9 cm)",
    price: "$2.500",
    image: dulce1,
  },
  {
    id: "2",
    name: "Alfajores de Coctel",
    description: "Una tapa de chocolate blanco , manjar y una galleta (3,5 cm)",
    price: "$1.000",
    image: dulce2,
  },
  {
    id: "3",
    name: "Cake Pops",
    description: "Sabor chocolate o manjar bañados en chocolate blanco con diseños personalizados con imágenes o bañados en colores",
    price: "$1.300",
    image: dulce3,
  },
  {
    id: "4",
    name: "Barra de chocolate personalizadas",
    description: "Hechas con 3 chocolates , de leche , amargo y blanco personalizadas con una imagen",
    price: "$5.000",
    image: dulce4,
  },
  {
    id: "5",
    name: "Pack de galletas casita",
    description: "6 galletas para armar tu casita más glaseado",
    price: "$20.000",
    image: dulce5,
  },
  {
    id: "6",
    name: "Mini paletas",
    description: "Caramelos translúcidos de sabores frutales",
    price: "$700",
    image: dulce6,
  },
  {
    id: "7",
    name: "Candy Bar Personalizado",
    description: "Alfajores, paletas y cake pops\nOpciones disponibles en 30, 60 o 90 unidades",
    price: "$42.000 / $78.000 / $96.000",
    image: dulce7,
    variants: [
      { quantity: 30, price: "$42.000" },
      { quantity: 60, price: "$78.000" },
      { quantity: 90, price: "$96.000" },
    ],
  },
  {
    id: "8",
    name: "Paletas temáticas",
    description: "paletas de chocolate temáticas que pueden ser de chocolate de leche, amargo o blanco",
    price: "$800",
    image: dulce8,
  },
];

const ProductCatalog = ({ productQuantities, onUpdateQuantity }: ProductCatalogProps) => {
  return (
    <section id="productos" className="py-16 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Nuestros Dulces
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestra deliciosa selección de dulces artesanales
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              quantity={productQuantities[product.id] || 0}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;