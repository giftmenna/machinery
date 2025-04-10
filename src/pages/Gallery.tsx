import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Interface for the src object (image URLs in different sizes)
interface PexelsPhotoSrc {
  large: string;
  medium: string;
  small: string;
  [key: string]: string;
}

// Interface for a single photo from Pexels
interface PexelsPhoto {
  id: number;
  src: PexelsPhotoSrc;
  alt?: string;
  [key: string]: any;
}

// Interface for the full Pexels API response
interface PexelsResponse {
  photos: PexelsPhoto[];
}

const Gallery = () => {
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the API key from the environment variable (Vite syntax)
  const API_KEY =
    import.meta.env.VITE_PEXELS_API_KEY ||
    "bf9Q3nUf5DIXyujkbnwEzndkp0MKRQz5migwJhyacAzG7w2Ys0EdsqtK";
  const PHOTOS_PER_PAGE = 50;
  const QUERY = "machinery"; // Query for machinery photos

  // Fetch photos from Pexels API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${QUERY}&per_page=${PHOTOS_PER_PAGE}`,
          {
            headers: {
              Authorization: API_KEY,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch photos");
        }
        const data = (await response.json()) as PexelsResponse;
        setPhotos(data.photos || []);
        setLoading(false);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Our Machinery in Action
        </h2>
        {loading && (
          <p className="text-center text-gray-600">Loading photos...</p>
        )}
        {error && (
          <p className="text-center text-red-500">
            Error: {error}. Please try again later.
          </p>
        )}
        {!loading && !error && photos.length === 0 && (
          <p className="text-center text-gray-600">No photos found.</p>
        )}
        {!loading && !error && photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative h-64 rounded-lg overflow-hidden"
              >
                <img
                  src={photo.src.large} // High-quality image size
                  alt={photo.alt || "Machinery in action"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy" // Optimize performance
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/400x300?text=Image+Not+Available")
                  } // Fallback image
                />
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link
            to="/contact"
            className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors"
          >
            Contact Us for More
            <ArrowRight className="ml-3" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Gallery;