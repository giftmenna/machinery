import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-center">
              <Phone size={18} className="mr-2 text-gray-900" />
              +1 (555) 123-4567
            </li>
            <li className="flex items-center">
              <Mail size={18} className="mr-2 text-gray-900" />
              info@heavymachinery.com
            </li>
            <li className="flex items-center">
              <MapPin size={18} className="mr-2 text-gray-900" />
              123 Industry Ave, NY 10001
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                placeholder="Your Message"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors"
            >
              Send Message
            </button>
          </form>
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

export default Contact;