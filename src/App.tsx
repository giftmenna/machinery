import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Gallery from "./pages/Gallery";
import TrackingPage from "./pages/TrackingPage";
import AdminDashboard from "./pages/AdminDashboard";
import { CartItem } from "./types";

interface TrackingEvent {
  location: string;
  status: string;
  dateTime: string | null;
  lat: number;
  lng: number;
  estimatedArrival?: string | null;
}

const fullJourney: TrackingEvent[] = [
  { location: "China", status: "Picked up", dateTime: null, lat: 39.9042, lng: 116.4074 }, // Beijing
  { location: "Russia", status: "Customs on hold", dateTime: null, lat: 55.7512, lng: 37.6184 }, // Moscow
  { location: "Turkey", status: "Shipment in progress", dateTime: null, lat: 41.0082, lng: 28.9784 }, // Istanbul
  { location: "Final Destination", status: "Delivered", dateTime: null, lat: 34.0522, lng: -118.2437 }, // Los Angeles (unchanged)
];

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products cart={cart} setCart={setCart} />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
            <Route path="/tracking" element={<TrackingPage fullJourney={fullJourney} />} />
            <Route path="/admin" element={<AdminDashboard fullJourney={fullJourney} />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;