// Geocoding service for converting addresses to coordinates and vice versa
// Uses OpenStreetMap Nominatim API (free, no API key required)

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Geocode an address to get latitude and longitude
export const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=in`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        address: result.display_name,
        confidence: parseFloat(result.importance) || 0
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to geocode address');
  }
};

// Reverse geocode coordinates to get address
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }
    
    const data = await response.json();
    
    if (data && data.display_name) {
      return {
        address: data.display_name,
        components: data.address || {}
      };
    }
    
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error('Failed to reverse geocode coordinates');
  }
};

// Parse coordinate string (e.g., "28.6139, 77.2090" or "28.6139,77.2090")
export const parseCoordinates = (coordinateString) => {
  if (!coordinateString || typeof coordinateString !== 'string') {
    return null;
  }
  
  // Remove extra spaces and split by comma
  const parts = coordinateString.trim().split(',').map(part => part.trim());
  
  if (parts.length !== 2) {
    return null;
  }
  
  const latitude = parseFloat(parts[0]);
  const longitude = parseFloat(parts[1]);
  
  // Validate coordinates
  if (isNaN(latitude) || isNaN(longitude)) {
    return null;
  }
  
  if (latitude < -90 || latitude > 90) {
    return null;
  }
  
  if (longitude < -180 || longitude > 180) {
    return null;
  }
  
  return { latitude, longitude };
};

// Validate if coordinates are within India (approximate bounds)
export const isWithinIndia = (latitude, longitude) => {
  return (
    latitude >= 6.0 && latitude <= 37.0 &&
    longitude >= 68.0 && longitude <= 97.0
  );
};

// Get current location using browser geolocation API
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

// Search suggestions for addresses (for autocomplete)
export const getAddressSuggestions = async (query, limit = 5) => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&countrycodes=in&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Address suggestions request failed');
    }
    
    const data = await response.json();
    
    return data.map(item => ({
      display_name: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      importance: parseFloat(item.importance) || 0
    }));
  } catch (error) {
    console.error('Address suggestions error:', error);
    return [];
  }
};
