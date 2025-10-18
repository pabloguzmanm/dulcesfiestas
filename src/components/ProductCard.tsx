import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  quantity: number;
  onUpdateQuantity: (id: string, name: string, quantity: number, variant?: number) => void;
  variants?: { quantity: number; price: string }[];
}

const ProductCard = ({ id, name, description, price, image, quantity, onUpdateQuantity, variants }: ProductCardProps) => {
  const handleIncrease = () => {
    onUpdateQuantity(id, name, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      onUpdateQuantity(id, name, quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      onUpdateQuantity(id, name, value);
    }
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const variantQuantity = parseInt(e.target.value) || 0;
    onUpdateQuantity(id, name, variantQuantity, variantQuantity); // Update with selected variant
  };

  return (
    <Card className="w-full max-w-xs min-h-[400px] flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="aspect-square overflow-hidden bg-muted h-[200px]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4 flex flex-col space-y-3 flex-1">
        <h3 className="font-semibold truncate whitespace-nowrap max-w-full text-lg">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{description.length < 50 ? `${description}\nDetalles adicionales...` : description}</p>
        <div className="text-center">
          <span className="text-2xl font-bold text-primary">{price}</span>
        </div>
        {variants && variants.length > 0 ? (
          <div className="flex justify-center">
            <select
              value={quantity === 0 ? "" : quantity} // Default to empty string if no selection
              onChange={handleVariantChange}
              className="w-full max-w-xs p-2 border rounded-md text-center"
            >
              <option value="" disabled>Seleccionar</option>
              {variants.map((variant) => (
                <option key={variant.quantity} value={variant.quantity}>
                  {`${variant.quantity} unidades - ${variant.price}`}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDecrease}
                size="icon"
                variant="outline"
                className="h-8 w-8"
                disabled={quantity === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="0"
                value={quantity}
                onChange={handleInputChange}
                className="text-center h-8 w-14"
              />
              <Button
                onClick={handleIncrease}
                size="icon"
                variant="outline"
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;