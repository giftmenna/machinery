import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">About Heavy Machinery</h1>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="text-gray-600 mb-6">
          Founded in 1990, Heavy Machinery has been a trusted provider of premium construction and industrial equipment. We pride ourselves on delivering quality machinery and exceptional customer service to businesses worldwide.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-6">
          Our mission is to empower your projects with reliable, high-performance machinery, backed by expert support and flexible financing options.
        </p>
        <div className="text-center">
          <Link
            to="/contact"
            className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            Contact Us
            <ArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;