import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Truck, Warehouse, Package, CheckCircle } from "lucide-react";
import { Tooltip } from "@mui/material";

interface TrackingEvent {
  location: string;
  status: string;
  dateTime: string | null;
  lat: number;
  lng: number;
  estimatedArrival?: string | null;
}

interface AdminDashboardProps {
  fullJourney: TrackingEvent[];
}

export default function AdminDashboard({ fullJourney }: AdminDashboardProps) {
  const [trackingId, setTrackingId] = useState<string>("");
  const [location, setLocation] = useState<string>(fullJourney[0].location);
  const [status, setStatus] = useState<string>("");
  const [dateTime, setDateTime] = useState<string>("");
  const [estimatedArrival, setEstimatedArrival] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [previewJourney, setPreviewJourney] = useState<TrackingEvent[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoggedIn(!!session);
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    } else {
      setLoggedIn(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId || !location || !status) {
      alert("Please fill in all required fields (Tracking ID, Location, Status)");
      return;
    }

    const newEvent: TrackingEvent = {
      location,
      status,
      dateTime: dateTime || null,
      lat: fullJourney.find((step) => step.location === location)!.lat,
      lng: fullJourney.find((step) => step.location === location)!.lng,
      ...(estimatedArrival && location === fullJourney[fullJourney.length - 1].location && { estimatedArrival }),
    };

    const { error } = await supabase
      .from("tracking_data")
      .upsert(
        {
          tracking_id: trackingId,
          location: newEvent.location,
          status: newEvent.status,
          date_time: newEvent.dateTime,
          lat: newEvent.lat,
          lng: newEvent.lng,
          estimated_arrival: newEvent.estimatedArrival,
        },
        { onConflict: ["tracking_id", "location"] }
      );

    if (error) {
      console.error("Error upserting tracking data:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      alert("Failed to save update: " + error.message);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("tracking_data")
      .select("*")
      .eq("tracking_id", trackingId);

    if (fetchError) {
      console.error("Error fetching preview data:", fetchError);
    } else {
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
      setPreviewJourney(mergedJourney);
    }

    alert(`Update added for ${trackingId} at ${location}${estimatedArrival ? " with estimated arrival" : ""}`);
    setStatus("");
    setDateTime("");
    setEstimatedArrival("");
  };

  const generateTrackingId = () => {
    const newId = `HM${Math.floor(100000 + Math.random() * 900000)}`;
    setTrackingId(newId);
  };

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

  const currentIndex = previewJourney.length
    ? previewJourney.reduce((lastIndex, event, index) => (event.dateTime ? index : lastIndex), -1)
    : -1;

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border rounded-md mb-4 text-black"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border rounded-md mb-4 text-black"
            />
            <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
        <button onClick={handleLogout} className="mb-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-400">
          Logout
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Add Shipment Update</h2>
            <form onSubmit={handleAddUpdate} className="grid gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  placeholder="Tracking ID (e.g., HM654321)"
                  className="p-3 border rounded-md flex-1 text-black"
                />
                <button type="button" onClick={generateTrackingId} className="bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-400">
                  Generate ID
                </button>
              </div>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="p-3 border rounded-md text-black">
                {fullJourney.map((step) => (
                  <option key={step.location} value={step.location}>
                    {step.location}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Status (e.g., Customs on hold)"
                className="p-3 border rounded-md text-black"
              />
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="p-3 border rounded-md text-black"
              />
              {location === fullJourney[fullJourney.length - 1].location && (
                <input
                  type="datetime-local"
                  value={estimatedArrival}
                  onChange={(e) => setEstimatedArrival(e.target.value)}
                  placeholder="Estimated Arrival"
                  className="p-3 border rounded-md text-black"
                />
              )}
              <button type="submit" className="bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 transition-colors">
                Add Update
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Preview</h2>
            {previewJourney.length > 0 && (
              <Timeline>
                {previewJourney.map((event, index) => {
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
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <Tooltip title={event.status} arrow>
                          <TimelineDot
                            color={isCompleted ? (isFailed ? "error" : "success") : isActive ? "primary" : "inherit"}
                            className="shadow-lg"
                          />
                        </Tooltip>
                        {index !== previewJourney.length - 1 && (
                          <TimelineConnector className={connectorColorClass} sx={{ minHeight: "60px", width: "4px" }} />
                        )}
                      </TimelineSeparator>
                      <TimelineContent>
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(event.status, isCompleted, isActive)}
                            <div>
                              <p className={`text-lg font-semibold ${textColorClass}`}>{event.location}</p>
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
                  );
                })}
              </Timeline>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}