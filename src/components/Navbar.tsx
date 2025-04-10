import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Heavy Machinery
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded-md">
                Home
              </Link>
              <Link to="/products" className="hover:bg-gray-700 px-3 py-2 rounded-md">
                Products
              </Link>
              <Link to="/about" className="hover:bg-gray-700 px-3 py-2 rounded-md">
                About
              </Link>
              <Link to="/contact" className="hover:bg-gray-700 px-3 py-2 rounded-md">
                Contact
              </Link>
              <Link to="/tracking" className="hover:bg-gray-700 px-3 py-2 rounded-md">
                Tracking
              </Link>
              <Link to="/admin" className="hover:bg-gray-700 px-3 py-2 rounded-md">
                Admin
              </Link>
              <Link to="/cart" className="hover:bg-gray-700 px-3 py-2 rounded-md">
                <ShoppingCart className="inline-block" />
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/tracking"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Tracking
            </Link>
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
            <Link
              to="/cart"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Cart
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}