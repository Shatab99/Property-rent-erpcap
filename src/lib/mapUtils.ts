import L from 'leaflet';

// Create a custom icon for property markers
export const createPropertyMarker = () => {
    return new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        shadowAnchor: [12, 41],
    });
};

export const geocodeAddress = async (streetNumber: string, streetName: string, county: string, city: string, stateOrProvince: string, postalCode: string): Promise<[number, number] | null> => {
    try {
        const fullAddress = `${streetNumber} ${streetName} Street, ${county}, ${city}, ${stateOrProvince} ${postalCode}, USA`;

        // Using OpenStreetMap Nominatim API (free, no key required)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
};
