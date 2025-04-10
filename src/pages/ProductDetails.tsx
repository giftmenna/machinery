import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Product } from "../types"; // Update the path to the correct file where Product is defined
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-16 text-xl text-gray-600">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6">Product Not Found</h1>
        <Link
          to="/products"
          className="inline-flex items-center bg-yellow-500 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors"
        >
          Back to Products
          <ArrowRight className="ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg shadow-md"
        />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
          <p className="text-2xl font-bold text-gray-900 mb-6">
            ${product.price.toLocaleString()}
          </p>
          <Link
            to="/cart"
            className="inline-flex items-center bg-yellow-500 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors"
          >
            Add to Cart
            <ArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/products"
          className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
        >
          Back to Products
          <ArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;