import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-[700px] bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Global Machinery Solutions
            </h1>
            <p className="text-xl md:text-3xl mb-10 max-w-3xl">
              Powering projects worldwide with innovative, high-performance equipment across Europe, Asia, and the Americas.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-yellow-500 text-black px-8 py-4 rounded-md font-semibold text-lg hover:bg-yellow-400 transition-colors"
            >
              Explore Our Range
              <ArrowRight className="ml-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Why GlobalMachInnovations?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Precision Engineering</h3>
              <p className="text-gray-600">
                Top-tier machinery crafted with European precision, Asian ingenuity, and American durability.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Global Support</h3>
              <p className="text-gray-600">
                Expert teams across continents, ready to provide tailored solutions and technical assistance.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Flexible Financing</h3>
              <p className="text-gray-600">
                Customized financing plans to empower businesses of all sizes, anywhere in the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Machinery in Action</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <img
                src="https://ypthzcdkdbbdqogyyhwm.supabase.co/storage/v1/object/public/images//excavator.JPG"
                alt="Excavator at work"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                alt="Cranes on site"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <img
                src="https://ypthzcdkdbbdqogyyhwm.supabase.co/storage/v1/object/public/images//bulldozer.JPG"
                alt="Bulldozer operation"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?auto=format&fit=crop&q=80"
                alt="Industrial machinery"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              to="/gallery"
              className="text-gray-900 underline font-semibold hover:text-gray-700"
            >
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">
                "GlobalMachInnovations provided us with top-notch equipment that transformed our operations in Germany."
              </p>
              <p className="font-semibold">— Hans Müller, Construction Lead</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">
                "Their support team in Asia helped us secure the perfect machinery for our factory expansion."
              </p>
              <p className="font-semibold">— Li Wei, Manufacturing Director</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Power Your Next Project?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Explore our extensive catalog of cutting-edge machinery and connect with our global team today.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors"
          >
            Get in Touch
            <ArrowRight className="ml-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}