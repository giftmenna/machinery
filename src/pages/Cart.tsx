import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CartItem } from "../types"; // Adjusted to import CartItem from the correct file
import toast from "react-hot-toast"; // For notifications

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const Cart: React.FC<CartProps> = ({ cart, setCart }) => {
  const handlePrint = () => {
    window.print();
    toast.success("Printing your cart...");
  };

  const total = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6">Your Cart is Empty</h1>
        <Link
          to="/products"
          className="inline-flex items-center bg-yellow-500 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors"
        >
          Shop Now
          <ArrowRight className="ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Your Cart</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-4"
          >
            <div className="flex items-center">
              <img
                src={item.product?.image_url}
                alt={item.product?.name}
                className="w-20 h-20 object-cover rounded-md mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{item.product?.name}</h3>
                <p className="text-gray-600">${item.product?.price.toLocaleString()} each</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg">Qty: {item.quantity}</span>
              <p className="text-xl font-bold">
                ${(item.product?.price || 0) * item.quantity}
              </p>
            </div>
          </div>
        ))}

        <div className="mt-6 flex justify-between items-center">
          <p className="text-2xl font-bold">Total: ${total.toLocaleString()}</p>
          <button
            onClick={handlePrint}
            className="bg-gray-900 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            Print Your Tray
          </button>
        </div>

        <div className="mt-6 text-gray-600">
          <p>
            To proceed with your order, please contact our official email:{" "}
            <a href="mailto:info@heavymachinery.com" className="text-yellow-500 hover:underline">
              info@heavymachinery.com
            </a>
          </p>
          <div className="mt-4">
            <label htmlFor="payment" className="block text-sm font-medium text-gray-700">
              Payment Information (Test Mode)
            </label>
            <input
              type="text"
              id="payment"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              placeholder="Enter payment details (for testing only)"
              disabled
            />
            <p className="mt-2 text-sm text-red-600">
              This is a test app and is not safe to include payment information.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/products"
          className="inline-flex items-center bg-yellow-500 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors"
        >
          Continue Shopping
          <ArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default Cart;