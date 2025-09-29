# Transport Logistics Map Component

This component provides an interactive map interface for viewing and managing transport logistics services using OpenStreetMap.

## Features

- **Interactive Map**: Uses OpenStreetMap with react-leaflet for smooth map interactions
- **Location Search**: Search for locations by city name (Delhi, Mumbai, Bangalore, etc.)
- **Nearby Transport Services**: Find transport logistics services within a specified radius of the searched location
- **Distance Calculation**: Shows distance from the center point to each logistics location
- **Web-like Connections**: Visual connections between logistics points when one is selected
- **Responsive Design**: Works on both desktop and mobile devices

## Usage

1. **Access the Map**: Navigate to `/admin/logistics-map` (requires admin authentication)
2. **Search Location**: Enter a city name in the search box (e.g., "Delhi", "Mumbai")
3. **Adjust Radius**: Use the slider to set the search radius (5-100 km)
4. **View Results**: See nearby logistics in the sidebar and on the map
5. **Select Transport Service**: Click on any transport service item to see connections to other nearby services

## Data Structure

Each transport logistics entry should have the following structure:

```javascript
{
  id: "unique-id",
  name: "Transport Service Name",
  type: "Truck Service", // or "Delivery Service", "Cargo Service", etc.
  address: "Full Address",
  latitude: 28.6139, // Decimal degrees
  longitude: 77.2090, // Decimal degrees
  contact: "+91-9876543210",
  status: "active"
}
```

## Dependencies

- `leaflet`: OpenStreetMap library
- `react-leaflet`: React components for Leaflet
- `firebase`: For data management

## Styling

The component uses CSS modules for styling. Key classes:
- `.logistics-map-container`: Main container
- `.logistics-list`: Sidebar with logistics items
- `.map-container`: Map wrapper
- `.logistics-item`: Individual logistics item in sidebar

## Sample Data

Use the `sampleLogisticsData.js` file to populate Firebase with test data:

```javascript
import { populateSampleData } from '../../../Backend/firebase/sampleLogisticsData.js';
populateSampleData();
```

## Geocoding

Currently uses a simplified geocoding system for major Indian cities. For production, integrate with:
- Google Maps Geocoding API
- OpenStreetMap Nominatim API
- Mapbox Geocoding API

## Future Enhancements

- Real-time data updates
- Advanced filtering options
- Route optimization
- Real-time tracking
- Mobile app integration
