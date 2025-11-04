"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
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
  onMapClick?: (lat: number, lng: number) => void;
  onCountyClick?: (countyName: string) => void;
  loading: boolean;
  counties?: Record<string, [number, number]>;
  showCountyCircles?: boolean;
  isCountySelected?: boolean;
  selectedCountyCoordinates?: [number, number];
}

// Zoom configuration types
interface ZoomConfig {
  minZoom: number;
  maxZoom: number;
  initialZoom: number;
  countyZoom: number;
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
function MapUpdater({ 
  center, 
  isCountySelected,
  previousCountySelected 
}: { 
  center: [number, number];
  isCountySelected: boolean;
  previousCountySelected: React.MutableRefObject<boolean>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !center) return;

    // Use flyTo for smooth transition when county is selected
    if (isCountySelected && !previousCountySelected.current) {
      // Transitioning from county circles to county view
      map.flyTo(center, 13, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
      previousCountySelected.current = true;
    } else if (!isCountySelected && previousCountySelected.current) {
      // Transitioning back to county circles view
      map.flyTo(center, 7, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
      previousCountySelected.current = false;
    } else {
      // Simple setView for regular updates
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, isCountySelected, map, previousCountySelected]);

  return null;
}

// Component to manage dynamic zoom constraints
function ZoomController({ 
  isCountySelected,
  minZoom: initialMinZoom = 5,
  maxZoom: initialMaxZoom = 10,
  countyMinZoom = 10,
  countyMaxZoom = 18,
}: { 
  isCountySelected: boolean;
  minZoom?: number;
  maxZoom?: number;
  countyMinZoom?: number;
  countyMaxZoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (isCountySelected) {
      // County view: allow deeper zoom-in
      map.setMinZoom(countyMinZoom);
      map.setMaxZoom(countyMaxZoom);
    } else {
      // County circles view: broader view
      map.setMinZoom(initialMinZoom);
      map.setMaxZoom(initialMaxZoom);
    }
  }, [isCountySelected, map, initialMinZoom, initialMaxZoom, countyMinZoom, countyMaxZoom]);

  return null;
}

// Component to handle map click events
function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !onMapClick) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, onMapClick]);

  return null;
}

export default function PropertyMap({
  markers,
  center,
  onMarkerClick,
  onMapClick,
  onCountyClick,
  loading,
  counties,
  showCountyCircles = true,
  isCountySelected = false,
  selectedCountyCoordinates,
}: PropertyMapProps) {
  const markerIcon = createPropertyMarker();
  const previousCountySelectedRef = React.useRef(false);

  if (loading) {
    return null;
  }

  // Allow rendering map if we have markers OR if we should show county circles
  if (markers.length === 0 && !showCountyCircles) {
    return null;
  }

  // Determine the actual center to use for the map
  const mapCenter = isCountySelected && selectedCountyCoordinates 
    ? selectedCountyCoordinates 
    : center;

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={isCountySelected ? 13 : 7} 
      minZoom={5}
      maxZoom={10}
      className="w-full h-screen px-3 py-3 sm:p-0 sm:mx-auto sm:container sm:h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater 
        center={mapCenter} 
        isCountySelected={isCountySelected}
        previousCountySelected={previousCountySelectedRef}
      />
      <ZoomController 
        isCountySelected={isCountySelected}
        minZoom={5}
        maxZoom={10}
        countyMinZoom={10}
        countyMaxZoom={18}
      />
      <MapClickHandler onMapClick={onMapClick} />
      {/* Render county circles only when showCountyCircles is true */}
      {showCountyCircles && counties && Object.entries(counties).map(([countyName, [lat, lng]]) => (
        <React.Fragment key={countyName}>
          <Circle
            center={[lat, lng]}
            radius={10000}
            pathOptions={{
              fillColor: "#3b82f6",
              fillOpacity: 0.2,
              color: "#3b82f6",
              weight: 2,
              opacity: 0.6,
            }}
            eventHandlers={{
              click: () => {
                onCountyClick?.(countyName);
              },
            }}
          />
          <Marker
            position={[lat, lng]}
            icon={L.divIcon({
              html: `<div style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                pointer-events: none;
              ">
                <span style="
                  font-size: 12px;
                  font-weight: 600;
                  color: #1e40af;
                  text-align: center;
                  background: rgba(255, 255, 255, 0.9);
                  padding: 4px 8px;
                  border-radius: 4px;
                  white-space: nowrap;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                ">${countyName}</span>
              </div>`,
              className: "county-label",
              iconSize: [140, 40],
              iconAnchor: [70, 20],
            })}
            eventHandlers={{
              click: () => {
                onCountyClick?.(countyName);
              },
            }}
          />
        </React.Fragment>
      ))}
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
                    ${marker.price?.toLocaleString()}
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
