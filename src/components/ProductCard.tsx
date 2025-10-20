// ProductCard.tsx (versión optimizada para alineación)
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  quantity: number;
  variants?: { quantity: number; price: string }[];
  onUpdateQuantity: (id: string, name: string, quantity: number, variant?: string) => void;
}

const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  quantity,
  variants,
  onUpdateQuantity,
}: ProductCardProps) => {
  const handleIncrease = () => onUpdateQuantity(id, name, quantity + 1);
  const handleDecrease = () => onUpdateQuantity(id, name, Math.max(0, quantity - 1));
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onUpdateQuantity(id, name, value);
  };
  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQuantity = parseInt(e.target.value);
    onUpdateQuantity(id, name, selectedQuantity);
  };

  return (
    <Card className="w-full min-h-[480px] flex flex-col overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
      <div className="aspect-square w-full overflow-hidden bg-muted/50 rounded-xl mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-0 flex flex-col flex-1">
        {/* Nombre: altura fija */}
        <h3 className="font-bold text-lg md:text-xl text-center mb-2 line-clamp-2 text-foreground">
          {name}
        </h3>
        {/* Descripción: crece pero con límite */}
        <p className="text-muted-foreground text-sm text-center mb-4 flex-1 line-clamp-3">
          {description}
        </p>
        {/* Precio: siempre centrado */}
        <div className="text-center mb-4">
          <span className="text-xl md:text-2xl font-extrabold text-primary">{price}</span>
        </div>
        {/* Controles: siempre en la parte inferior */}
        <div className="mt-auto">
          {variants && variants.length > 0 ? (
            <div className="flex justify-center">
              <select
                value={quantity === 0 ? "" : quantity}
                onChange={handleVariantChange}
                className="w-full max-w-[180px] p-2 border border-input rounded-lg bg-background text-foreground text-center hover:bg-accent/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="" disabled>
                  Seleccionar
                </option>
                {variants.map((variant) => (
                  <option key={variant.quantity} value={variant.quantity}>
                    {`${variant.quantity} unidades - ${variant.price}`}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <Button
                onClick={handleDecrease}
                size="icon"
                variant="outline"
                className="h-9 w-9 bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 disabled:opacity-50"
                disabled={quantity === 0}
              >
                <Minus className="h-4 w-4 text-primary" />
              </Button>
              <Input
                type="number"
                min="0"
                value={quantity}
                onChange={handleInputChange}
                className="text-center h-9 w-20 text-sm border-2 border-primary/20 focus:border-primary transition-all duration-200"
              />
              <Button
                onClick={handleIncrease}
                size="icon"
                variant="outline"
                className="h-9 w-9 bg-secondary/10 hover:bg-secondary/20 transition-all duration-200"
              >
                <Plus className="h-4 w-4 text-primary" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;