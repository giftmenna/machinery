import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { Product, CartItem } from "../types"; // Adjust the path to the correct file containing these types

interface ProductsProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const Products: React.FC<ProductsProps> = ({ cart, setCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products from Supabase...");
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .limit(50);

        if (error) {
          throw new Error(error.message);
        }

        console.log("Fetched data:", data);
        if (!data || data.length === 0) {
          console.warn("No products found in the database.");
        }

        const formattedData = data?.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          image_url: item.image_url,
          category: item.category,
          created_at: item.created_at,
        })) || [];

        setProducts(formattedData);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setError(error.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    const existingItem = cart.find((cartItem) => cartItem.product_id === product.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.product_id === product.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      const newCartItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        user_id: "anonymous", // No user required
        product_id: product.id,
        quantity: 1,
        created_at: new Date().toISOString(),
        product: product,
      };
      setCart([...cart, newCartItem]);
    }
  };

  const removeFromCart = (product: Product) => {
    const existingItem = cart.find((cartItem) => cartItem.product_id === product.id);
    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((cartItem) =>
          cartItem.product_id === product.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    } else if (existingItem) {
      setCart(cart.filter((cartItem) => cartItem.product_id !== product.id));
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-xl text-gray-600">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-16 text-xl text-red-600">
        Error: {error}
        <div className="mt-4">
          <Link
            to="/"
            className="inline-flex items-center bg-yellow-500 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-xl text-gray-600">
        No products found in the database.
        <div className="mt-4">
          <Link
            to="/"
            className="inline-flex items-center bg-yellow-500 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Our Heavy Machinery Collection</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link to={`/products/${product.id}`}>
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-80 object-cover"
              />
            </Link>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
              <p className="text-2xl font-bold text-gray-900 mb-4">
                ${product.price.toLocaleString()}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeFromCart(product)}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-lg font-semibold">
                    {(cart.find((item) => item.product_id === product.id)?.quantity) || 0}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-2 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="mt-12 text-center">
          <Link
            to="/cart"
            className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            View Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
          </Link>
        </div>
      )}
    </div>
  );
};

export default Products;