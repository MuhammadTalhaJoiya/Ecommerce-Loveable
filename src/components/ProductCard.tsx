
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
  description: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, viewMode, onAddToCart }: ProductCardProps) => {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 bg-white ${viewMode === 'list' ? 'flex flex-row' : 'hover:-translate-y-1'}`}>
      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'rounded-t-lg'}`}>
        <img 
          src={product.image} 
          alt={product.name}
          className={`object-cover group-hover:scale-110 transition-transform duration-300 ${viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'}`}
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <CardContent className={`${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''} p-4`}>
        <div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2">
            <Link to={`/product/${product.id}`} className="hover:text-blue-600 transition-colors">
              {product.name}
            </Link>
          </h3>
          
          {viewMode === 'list' && (
            <p className="text-gray-600 text-sm mb-3">{product.description}</p>
          )}
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
        
        <div className={`flex gap-2 ${viewMode === 'list' ? 'mt-4' : ''}`}>
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/product/${product.id}`}>View Details</Link>
          </Button>
          <Button 
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="flex-1"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
