// ProductCard.tsx (versión con fondo rosado sólido)
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
  onUpdateQuantity: (id: string, name: string, quantity: number, variant?: number) => void;
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
    const selectedVariant = e.target.value ? parseInt(e.target.value) : 0;
    if (selectedVariant === 0) {
      onUpdateQuantity(id, name, 0, undefined);
    } else {
      onUpdateQuantity(id, name, 0, selectedVariant);
    }
  };

  return (
    <Card className="w-full min-h-[480px] flex flex-col overflow-hidden bg-pink-50 p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
      <div className="aspect-square w-full overflow-hidden bg-muted/50 rounded-xl mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-0 flex flex-col flex-1">
        <h3 className="font-bold text-lg md:text-xl text-center mb-2 line-clamp-2 text-foreground">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm text-center mb-4 flex-1 line-clamp-3">
          {description}
        </p>
        <div className="text-center mb-4">
          <span className="text-xl md:text-2xl font-extrabold text-pink-600">{price}</span>
        </div>
        <div className="mt-auto">
          {variants && variants.length > 0 ? (
            <div className="flex justify-center">
              <select
                value={quantity || ""}
                onChange={handleVariantChange}
                className="w-full max-w-[180px] p-2 border border-input rounded-lg bg-white text-foreground text-center hover:bg-pink-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                className="h-9 w-9 bg-pink-100 hover:bg-pink-200 transition-all duration-200 disabled:opacity-50 border-pink-300"
                disabled={quantity === 0}
              >
                <Minus className="h-4 w-4 text-pink-600" />
              </Button>
              <Input
                type="number"
                min="0"
                value={quantity}
                onChange={handleInputChange}
                className="text-center h-9 w-20 text-sm border-2 border-pink-300 focus:border-pink-500 focus:ring-pink-500"
              />
              <Button
                onClick={handleIncrease}
                size="icon"
                variant="outline"
                className="h-9 w-9 bg-pink-100 hover:bg-pink-200 transition-all duration-200 border-pink-300"
              >
                <Plus className="h-4 w-4 text-pink-600" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;