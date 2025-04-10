import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">About GlobalMachInnovations</h1>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="text-gray-600 mb-6">
          Established in 1990, GlobalMachInnovations has grown from a trusted provider of premium construction and industrial equipment into a globally recognized leader in engineering machinery solutions. For over three decades, we’ve equipped businesses across Europe, Asia, and the Americas with cutting-edge tools to build the world’s infrastructure. Our legacy is built on an unwavering commitment to quality, innovation, and unparalleled customer service. With a presence spanning continents, we’ve become a cornerstone for industries worldwide, delivering machinery that powers progress and fosters success on a global scale.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-6">
          At GlobalMachInnovations, our mission is to drive your projects forward with reliable, high-performance machinery tailored to meet the demands of a dynamic world. We empower businesses—from local enterprises to multinational corporations—with advanced equipment, expert technical support, and flexible financing solutions. By bridging the strengths of European precision, Asian ingenuity, and American ambition, we aim to deliver not just machines, but partnerships that fuel growth and innovation across every corner of the globe.
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