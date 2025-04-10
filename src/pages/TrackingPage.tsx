import React, { useState, useEffect } from "react";
import { supabase } from "../supabase"; // Adjust path to your supabase.js file
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Truck, Warehouse, Package, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface TrackingEvent {
  location: string;
  status: string;
  dateTime: string | null;
  lat: number;
  lng: number;
  estimatedArrival?: string | null;
}

interface TrackingPageProps {
  fullJourney: TrackingEvent[];
}

export default function TrackingPage({ fullJourney }: TrackingPageProps) {
  const [trackingId, setTrackingId] = useState<string>(() => localStorage.getItem("trackingId") || "");
  const [displayedJourney, setDisplayedJourney] = useState<TrackingEvent[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (trackingId) {
      localStorage.setItem("trackingId", trackingId);
      fetchTrackingData(trackingId);
    }
  }, [trackingId]);

  const fetchTrackingData = async (id: string) => {
    setIsLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("tracking_data")
      .select("*")
      .eq("tracking_id", id);

    if (error) {
      console.error("Error fetching tracking data:", error);
      setError("Could not load tracking information. Please try again.");
      setDisplayedJourney(fullJourney.map((step) => ({ ...step, dateTime: null })));
    } else if (data.length > 0) {
      const updates = data.map((item) => ({
        location: item.location,
        status: item.status,
        dateTime: item.date_time,
        lat: item.lat,
        lng: item.lng,
        estimatedArrival: item.estimated_arrival,
      }));
      const mergedJourney = fullJourney.map((step) => {
        const update = updates.find((u) => u.location === step.location);
        return update || { ...step, dateTime: null };
      });
      setDisplayedJourney(mergedJourney);
    } else {
      setDisplayedJourney(fullJourney.map((step) => ({ ...step, dateTime: null })));
      setError("No updates yet for this tracking ID.");
    }
    setIsLoading(false);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) {
      setError("Please enter a tracking ID.");
      return;
    }
    fetchTrackingData(trackingId);
  };

  const currentIndex = displayedJourney.length
    ? displayedJourney.reduce((lastIndex, event, index) => (event.dateTime ? index : lastIndex), -1)
    : -1;

  const estimatedDelivery = displayedJourney.length && displayedJourney[displayedJourney.length - 1].estimatedArrival
    ? new Date(displayedJourney[displayedJourney.length - 1].estimatedArrival!).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const getStatusIcon = (status: string, isCompleted: boolean, isActive: boolean) => {
    const baseClass = "w-6 h-6";
    switch (status.toLowerCase()) {
      case "picked up":
        return <Package className={`${baseClass} ${isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-yellow-600"}`} />;
      case "customs on hold":
      case "customs held":
        return <Warehouse className={`${baseClass} ${isCompleted || isActive ? "text-red-600" : "text-gray-600"}`} />;
      case "shipment in progress":
        return <Truck className={`${baseClass} ${isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-blue-600"}`} />;
      case "delivered":
        return <CheckCircle className={`${baseClass} ${isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-green-600"}`} />;
      default:
        return <Package className={`${baseClass} ${isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-yellow-600"}`} />;
    }
  };

  const countryColors: { [key: string]: string } = {
    "China": "#FF5733",
    "Germany": "#FFC107",
    "USA": "#007BFF",
    "Final Destination": "#28A745",
  };

  useEffect(() => {
    if (currentIndex < 0 || !displayedJourney[currentIndex]) return;

    const currentEvent = displayedJourney[currentIndex];
    if (!currentEvent.lat || !currentEvent.lng || isNaN(currentEvent.lat) || isNaN(currentEvent.lng)) return;

    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    const map = L.map("map");
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const truckIconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
        <path d="M14 18H4"/>
        <path d="M4 14h11"/>
        <path d="M16 18h4a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 16.55 8H14"/>
        <circle cx="17" cy="18" r="2"/>
        <circle cx="7" cy="18" r="2"/>
      </svg>
    `;
    const truckIconUrl = `data:image/svg+xml;base64,${btoa(truckIconSvg)}`;
    const markerIcon = L.icon({
      iconUrl: truckIconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    L.marker([currentEvent.lat, currentEvent.lng], { icon: markerIcon })
      .addTo(map)
      .bindPopup(`<b>${currentEvent.location}</b><br>${currentEvent.status}`)
      .openPopup();

    const allPath = displayedJourney.filter(
      (event) => event.lat && event.lng && !isNaN(event.lat) && !isNaN(event.lng)
    );

    const completedPath = allPath.slice(0, currentIndex + 1);
    if (completedPath.length > 1) {
      for (let i = 0; i < completedPath.length - 1; i++) {
        const start = completedPath[i];
        const end = completedPath[i + 1];
        const segment = [
          [start.lat, start.lng],
          [end.lat, end.lng],
        ];
        L.polyline(segment, {
          color: countryColors[start.location] || "#007BFF",
          weight: 6,
          opacity: 1,
        }).addTo(map);
      }
    }

    const incompletePath = allPath.slice(currentIndex + 1);
    if (incompletePath.length > 0 && completedPath.length > 0) {
      const lastCompleted = completedPath[completedPath.length - 1];
      for (let i = 0; i < incompletePath.length; i++) {
        const start = i === 0 ? lastCompleted : incompletePath[i - 1];
        const end = incompletePath[i];
        const segment = [
          [start.lat, start.lng],
          [end.lat, end.lng],
        ];
        L.polyline(segment, {
          color: "#D3D3D3",
          weight: 6,
          opacity: 0.5,
        }).addTo(map);
      }
    }

    const allCoords = allPath.map((event) => [event.lat, event.lng]);
    if (allCoords.length > 0) {
      map.fitBounds(allCoords, { padding: [50, 50], maxZoom: 15 });
    } else {
      map.setView([currentEvent.lat, currentEvent.lng], 12);
    }

    return () => {
      map.remove();
    };
  }, [currentIndex, displayedJourney]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8 tracking-tight">
          Track Your Shipment
        </h1>
        <form onSubmit={handleTrack} className="mb-8" aria-label="Track shipment form">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
              placeholder="Enter Tracking ID (e.g., HM123456)"
              className="flex-1 p-4 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              aria-label="Tracking ID input"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-500 transition-colors shadow-md disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Tracking..." : "Track"}
            </button>
          </div>
        </form>

        {error && (
          <p className="text-red-600 text-center mb-6 bg-red-50 p-4 rounded-lg font-medium">
            {error}
          </p>
        )}

        {estimatedDelivery && displayedJourney.length > 0 && (
          <div className="mb-8 text-center">
            <p className="text-lg font-semibold text-gray-800">
              Estimated Delivery: <span className="text-blue-600">{estimatedDelivery}</span>
            </p>
          </div>
        )}

        {currentIndex >= 0 && displayedJourney[currentIndex]?.lat && displayedJourney[currentIndex]?.lng && (
          <div className="mb-8 bg-gray-100 rounded-lg p-4">
            <div id="map" className="w-full h-96 rounded-lg shadow-md" style={{ minHeight: "300px" }}></div>
          </div>
        )}

        <AnimatePresence>
          {displayedJourney.length > 0 && (
            <Timeline>
              {displayedJourney.map((event, index) => {
                const isCompleted = index < currentIndex;
                const isActive = index === currentIndex;
                const isFailed = event.status.toLowerCase().includes("hold") || event.status.toLowerCase().includes("held");

                let textColorClass = "text-gray-500";
                if (isCompleted) {
                  textColorClass = isFailed ? "text-red-600" : "text-green-600";
                } else if (isActive) {
                  textColorClass = isFailed ? "text-red-600" : "text-gray-700";
                }

                const connectorColorClass = isCompleted ? (isFailed ? "bg-red-600" : "bg-green-600") : "bg-gray-300";

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TimelineItem>
                      <TimelineSeparator>
                        <Tooltip title={event.status} arrow>
                          <TimelineDot
                            color={isCompleted ? (isFailed ? "error" : "success") : isActive ? "primary" : "inherit"}
                            className="shadow-lg transform transition-transform hover:scale-110"
                          />
                        </Tooltip>
                        {index !== displayedJourney.length - 1 && (
                          <TimelineConnector
                            className={connectorColorClass}
                            sx={{ minHeight: "80px", width: "4px" }}
                          />
                        )}
                      </TimelineSeparator>
                      <TimelineContent>
                        <div className="bg-gray-50 p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center gap-4">
                            {getStatusIcon(event.status, isCompleted, isActive)}
                            <div>
                              <p className={`text-xl font-semibold ${textColorClass}`}>
                                {event.location}
                              </p>
                              <p className={textColorClass}>{event.status}</p>
                              <p className={`text-sm ${textColorClass}`}>
                                {event.dateTime
                                  ? new Date(event.dateTime).toLocaleString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "Pending"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TimelineContent>
                    </TimelineItem>
                  </motion.div>
                );
              })}
            </Timeline>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}