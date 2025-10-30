"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  markers: Array<{
    id: string;
    listingKey: string;
    title: string;
    price: number;
    address: string;
    city: string;
    bedrooms: number | null;
    bathrooms: number | null;
    images: string[];
    coordinates: [number, number];
  }>;
  center: [number, number];
  onMarkerClick: (listingKey: string) => void;
  loading: boolean;
}

// Custom icon for markers
const createPropertyMarker = () => {
  return new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });
};

// Component to handle map updates when center changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (map && center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
}

export default function PropertyMap({
  markers,
  center,
  onMarkerClick,
  loading,
}: PropertyMapProps) {
  const markerIcon = createPropertyMarker();

  if (loading) {
    return null;
  }

//   console.log(markers)

  if (markers.length === 0) {
    return null;
  }

  return (
    <MapContainer center={center} zoom={13} className="w-full h-screen px-3 py-3 sm:p-0 sm:mx-auto sm:container sm:h-full z-0">
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      <MapUpdater center={center} />
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.coordinates} icon={markerIcon}>
          <Popup className="property-popup">
            <div className="w-56 sm:w-64">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-900">
                  {marker.title}
                </h3>
                <p className="text-xs text-gray-600">{marker.address}</p>
                <p className="text-xs text-gray-600">{marker.city}</p>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-bold text-blue-600">
                    ${marker.price.toLocaleString()}
                  </span>
                  <div className="text-xs text-gray-600 space-x-2">
                    {marker.bedrooms !== null && (
                      <span>{marker.bedrooms} bed</span>
                    )}
                    {marker.bathrooms !== null && (
                      <span>{marker.bathrooms} bath</span>
                    )}
                  </div>
                </div>
                {marker.images[0] && (
                  <img
                    src={marker.images[0]}
                    alt={marker.title}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                )}
                <Button
                  onClick={() => onMarkerClick(marker.listingKey)}
                  className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700"
                >
                  View Details
                </Button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
