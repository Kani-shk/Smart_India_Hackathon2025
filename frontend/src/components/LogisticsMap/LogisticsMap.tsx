import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getLogistics, getLogisticsNearby, calculateDistance } from '../../../../Backend/firebase/logisticsService';
import { 
  geocodeAddress, 
  reverseGeocode, 
  parseCoordinates, 
  isWithinIndia, 
  getCurrentLocation,
  getAddressSuggestions 
} from '../../services/geocodingService';
import LogisticsForm from './LogisticsForm';
import './LogisticsMap.css';

// TypeScript interfaces
interface LogisticsItem {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  contact: string;
  status: string;
}

interface ConnectionLine {
  from: [number, number];
  to: [number, number];
  distance: number;
}

interface MapControllerProps {
  center: [number, number];
  zoom: number;
}

interface EditFormData {
  id: string;
  name: string;
  contact: string;
  latitude: number;
  longitude: number;
}

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const logisticsIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [1, -25],
});

const centerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [1, -30],
});

const currentLocationIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [1, -35],
});

const MapController: React.FC<MapControllerProps> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

const LogisticsMap: React.FC = () => {
  const navigate = useNavigate();
  const [logistics, setLogistics] = useState<LogisticsItem[]>([]);
  const [filteredLogistics, setFilteredLogistics] = useState<LogisticsItem[]>([]);
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [coordinateInput, setCoordinateInput] = useState<string>('');
  const [searchType, setSearchType] = useState<'address' | 'coordinates'>('address');
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default to Delhi
  const [zoom, setZoom] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLogistics, setSelectedLogistics] = useState<LogisticsItem | null>(null);
  const [radius, setRadius] = useState<number>(50); // km
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [clickedCoordinates, setClickedCoordinates] = useState<[number, number] | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editingLogistics, setEditingLogistics] = useState<LogisticsItem | null>(null);
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    fetchLogistics();
    getCurrentUserLocation();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSuggestions && !(event.target as Element).closest('.address-input-wrapper')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  const getCurrentUserLocation = async (): Promise<void> => {
    try {
      const location = await getCurrentLocation();
      const coordinates: [number, number] = [location.latitude, location.longitude];
      setCurrentLocation(coordinates);
      
      // Get address from coordinates
      try {
        const reverseResult = await reverseGeocode(location.latitude, location.longitude);
        if (reverseResult) {
          setCurrentAddress(reverseResult.address);
        }
      } catch (err) {
        console.warn('Reverse geocoding failed:', err);
      }
    } catch (err) {
      console.warn('Failed to get current location:', err);
    }
  };

  const fetchLogistics = async (): Promise<void> => {
    try {
      setLoading(true);
      const logisticsData = await getLogistics();
      setLogistics(logisticsData);
      setFilteredLogistics(logisticsData);
      setError(null);
    } catch (err) {
      setError('Failed to load logistics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async (): Promise<void> => {
    const searchValue = searchType === 'address' ? searchLocation.trim() : coordinateInput.trim();
    
    if (!searchValue) {
      setError('Please enter a location or coordinates');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setShowSuggestions(false);

      let coordinates: [number, number];
      let address = '';

      if (searchType === 'coordinates') {
        // Parse coordinates
        const parsed = parseCoordinates(searchValue);
        if (!parsed) {
          setError('Invalid coordinates format. Please use: latitude, longitude (e.g., 28.6139, 77.2090)');
          return;
        }
        
        if (!isWithinIndia(parsed.latitude, parsed.longitude)) {
          setError('Coordinates are outside India. Please enter coordinates within India.');
          return;
        }
        
        coordinates = [parsed.latitude, parsed.longitude];
        
        // Get address from coordinates
        try {
          const reverseResult = await reverseGeocode(parsed.latitude, parsed.longitude);
          if (reverseResult) {
            address = reverseResult.address;
            setCurrentAddress(address);
          }
        } catch (err) {
          console.warn('Reverse geocoding failed:', err);
          address = `${parsed.latitude}, ${parsed.longitude}`;
        }
      } else {
        // Geocode address
        const geocodeResult = await geocodeAddress(searchValue);
        if (!geocodeResult) {
          setError('Location not found. Please try a different address or use coordinates.');
          return;
        }
        
        coordinates = [geocodeResult.latitude, geocodeResult.longitude];
        address = geocodeResult.address;
        setCurrentAddress(address);
      }
      
      setCenter(coordinates);
      setZoom(12);
      
      // Get nearby logistics
      const nearbyLogistics = await getLogisticsNearby(coordinates[0], coordinates[1], radius);
      setFilteredLogistics(nearbyLogistics);
      
      if (nearbyLogistics.length === 0) {
        setError(`No logistics found within ${radius}km of ${address || searchValue}. Try increasing the radius or searching a different location.`);
      }
    } catch (err) {
      setError('Failed to search location. Please check your internet connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle address input changes for suggestions
  const handleAddressChange = async (value: string): Promise<void> => {
    setSearchLocation(value);
    
    if (value.length > 2) {
      try {
        const addressSuggestions = await getAddressSuggestions(value);
        setSuggestions(addressSuggestions);
        setShowSuggestions(true);
      } catch (err) {
        console.warn('Failed to get address suggestions:', err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: any): void => {
    setSearchLocation(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Get current location
  const handleCurrentLocation = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const location = await getCurrentLocation();
      const coordinates: [number, number] = [location.latitude, location.longitude];
      
      setCenter(coordinates);
      setZoom(15);
      setCurrentLocation(coordinates);
      
      // Get address from coordinates
      try {
        const reverseResult = await reverseGeocode(location.latitude, location.longitude);
        if (reverseResult) {
          setCurrentAddress(reverseResult.address);
        }
      } catch (err) {
        console.warn('Reverse geocoding failed:', err);
      }
      
      // Get nearby logistics
      const nearbyLogistics = await getLogisticsNearby(location.latitude, location.longitude, radius);
      setFilteredLogistics(nearbyLogistics);
      
      if (nearbyLogistics.length === 0) {
        setError(`No logistics found within ${radius}km of your current location. Try increasing the radius.`);
      }
    } catch (err) {
      setError('Failed to get current location. Please ensure location access is enabled.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogisticsClick = (logisticsItem: LogisticsItem): void => {
    setSelectedLogistics(logisticsItem);
    setCenter([logisticsItem.latitude, logisticsItem.longitude]);
    setZoom(15);
  };

  const handleAddLogistics = async (): Promise<void> => {
    setShowAddForm(true);
    setClickedCoordinates(null);
    
    // Try to get current location and set as default
    try {
      const location = await getCurrentLocation();
      setClickedCoordinates([location.latitude, location.longitude]);
    } catch (err) {
      console.warn('Failed to get current location for form:', err);
      // Form will handle fallback to Delhi coordinates
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent): void => {
    if (showAddForm) {
      const { lat, lng } = e.latlng;
      setClickedCoordinates([lat, lng]);
    }
  };

  const handleFormSuccess = (): void => {
    setShowAddForm(false);
    setClickedCoordinates(null);
    fetchLogistics(); // Refresh the logistics list
  };

  const handleFormCancel = (): void => {
    setShowAddForm(false);
    setClickedCoordinates(null);
  };

  const getDistanceFromCenter = (logisticsItem: LogisticsItem): number => {
    if (!center) return 0;
    return calculateDistance(center[0], center[1], logisticsItem.latitude, logisticsItem.longitude);
  };

  const getConnectionLines = (): ConnectionLine[] => {
    if (!currentLocation) return [];
    
    return filteredLogistics.map(logisticsItem => ({
      from: currentLocation,
      to: [logisticsItem.latitude, logisticsItem.longitude],
      distance: calculateDistance(
        currentLocation[0], 
        currentLocation[1], 
        logisticsItem.latitude, 
        logisticsItem.longitude
      )
    }));
  };

  const handleEditLogistics = (logisticsItem: LogisticsItem): void => {
    setEditingLogistics(logisticsItem);
    setShowEditForm(true);
  };

  const handleEditFormSuccess = (): void => {
    setShowEditForm(false);
    setEditingLogistics(null);
    fetchLogistics(); // Refresh the logistics list
  };

  const handleEditFormCancel = (): void => {
    setShowEditForm(false);
    setEditingLogistics(null);
  };

  const connectionLines = getConnectionLines();

  return (
    <div className="logistics-map-container">
      <div className="logistics-map-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate('/admin/events')}>
            ← Back to Events
          </button>
          <h2>Logistics Map</h2>
        </div>
        <div className="search-controls">
          <div className="search-type-toggle">
            <button 
              className={`toggle-btn ${searchType === 'address' ? 'active' : ''}`}
              onClick={() => setSearchType('address')}
            >
              Address
            </button>
            <button 
              className={`toggle-btn ${searchType === 'coordinates' ? 'active' : ''}`}
              onClick={() => setSearchType('coordinates')}
            >
              Coordinates
            </button>
          </div>
          
          <div className="search-input-container">
            {searchType === 'address' ? (
              <div className="address-input-wrapper">
                <input
                  type="text"
                  placeholder="Enter address (e.g., Connaught Place, New Delhi)"
                  value={searchLocation}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  className="location-input"
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        <div className="suggestion-text">{suggestion.display_name}</div>
                        <div className="suggestion-coords">
                          {suggestion.latitude.toFixed(4)}, {suggestion.longitude.toFixed(4)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <input
                type="text"
                placeholder="Enter coordinates (e.g., 28.6139, 77.2090)"
                value={coordinateInput}
                onChange={(e) => setCoordinateInput(e.target.value)}
                className="location-input"
              />
            )}
          </div>
          
          <div className="radius-control">
            <label>Radius: {radius} km</label>
            <input
              type="range"
              min="5"
              max="100"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="radius-slider"
            />
          </div>
          
          <div className="search-buttons">
            <button 
              onClick={handleLocationSearch} 
              disabled={loading}
              className="search-btn"
            >
              {loading ? 'Searching...' : 'Search Location'}
            </button>
            <button 
              onClick={handleCurrentLocation} 
              disabled={loading}
              className="current-location-btn"
            >
              📍 Current Location
            </button>
            <button 
              onClick={handleAddLogistics} 
              className="add-logistics-btn"
            >
              🚛 Add Transport Service
            </button>
          </div>
        </div>
        
        {currentAddress && (
          <div className="current-address">
            <strong>Current Location:</strong> {currentAddress}
          </div>
        )}

        {showAddForm && (
          <div className="add-mode-indicator">
            <div className="add-mode-content">
              <span className="add-mode-icon">📍</span>
              <span className="add-mode-text">
                Form is pre-filled with your current location. Click on the map to change coordinates if needed.
              </span>
              <button 
                className="cancel-add-btn"
                onClick={handleFormCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="map-content">
        <div className="logistics-list">
          <h3>Nearby Transport Services ({filteredLogistics.length})</h3>
          <div className="logistics-items">
            {filteredLogistics.map((logisticsItem) => (
              <div 
                key={logisticsItem.id} 
                className={`logistics-item ${selectedLogistics?.id === logisticsItem.id ? 'selected' : ''}`}
                onClick={() => handleLogisticsClick(logisticsItem)}
              >
                <div className="logistics-info">
                  <h4>{logisticsItem.name}</h4>
                  <p className="logistics-type">{logisticsItem.type}</p>
                  <p className="logistics-address">{logisticsItem.address}</p>
                  <p className="logistics-distance">
                    Distance: {getDistanceFromCenter(logisticsItem).toFixed(2)} km
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="map-container">
          {loading ? (
            <div className="map-loading">
              <div className="loading-spinner"></div>
              <p>Loading map...</p>
            </div>
          ) : (
            <MapContainer
              center={center}
              zoom={zoom}
              style={{ height: '500px', width: '100%' }}
              ref={mapRef}
              eventHandlers={{
                click: handleMapClick
              }}
            >
            <MapController center={center} zoom={zoom} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Current location marker */}
            {currentLocation && (
              <Marker position={currentLocation} icon={currentLocationIcon}>
                <Popup>
                  <div>
                    <strong>Your Current Location</strong>
                    <br />
                    {currentAddress || 'Current Location'}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Center marker */}
            <Marker position={center} icon={centerIcon}>
              <Popup>
                <div>
                  <strong>Search Center</strong>
                  <br />
                  {searchLocation || 'Default Location'}
                </div>
              </Popup>
            </Marker>

            {/* Logistics markers */}
            {filteredLogistics.map((logisticsItem) => (
              <Marker
                key={logisticsItem.id}
                position={[logisticsItem.latitude, logisticsItem.longitude]}
                icon={logisticsIcon}
              >
                <Popup>
                  <div className="logistics-popup">
                    <strong>{logisticsItem.name}</strong>
                    <br />
                    <em>{logisticsItem.type}</em>
                    <br />
                    {logisticsItem.address}
                    <br />
                    <strong>Contact:</strong> {logisticsItem.contact || 'Not provided'}
                    <br />
                    <small>
                      Distance: {getDistanceFromCenter(logisticsItem).toFixed(2)} km
                    </small>
                    <br />
                    <button 
                      className="edit-logistics-btn"
                      onClick={() => handleEditLogistics(logisticsItem)}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Dotted connection lines from current location to logistics markers */}
            {currentLocation && connectionLines.map((line, index) => (
              <Polyline
                key={index}
                positions={[line.from, line.to]}
                color={line.distance < 10 ? '#28a745' : line.distance < 25 ? '#ffc107' : '#dc3545'}
                weight={3}
                opacity={0.8}
                dashArray="5,10"
              />
            ))}
          </MapContainer>
          )}
        </div>
      </div>

      {showAddForm && (
        <LogisticsForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          initialCoordinates={clickedCoordinates}
        />
      )}

      {showEditForm && editingLogistics && (
        <EditLogisticsForm
          logistics={editingLogistics}
          onSuccess={handleEditFormSuccess}
          onCancel={handleEditFormCancel}
        />
      )}
    </div>
  );
};

// Edit Logistics Form Component
interface EditLogisticsFormProps {
  logistics: LogisticsItem;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditLogisticsForm: React.FC<EditLogisticsFormProps> = ({ logistics, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<EditFormData>({
    id: logistics.id,
    name: logistics.name,
    contact: logistics.contact,
    latitude: logistics.latitude,
    longitude: logistics.longitude
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.contact.trim()) {
      setError('Contact is required');
      return false;
    }
    if (isNaN(formData.latitude) || isNaN(formData.longitude)) {
      setError('Valid coordinates are required');
      return false;
    }
    if (!isWithinIndia(formData.latitude, formData.longitude)) {
      setError('Coordinates must be within India');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Update logistics in state (for now, since we're using local state)
      // In a real app, you'd call an API to update the backend
      const updatedLogistics = {
        ...logistics,
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude
      };

      // Here you would typically call an update API
      // await updateLogistics(updatedLogistics);
      
      onSuccess();
    } catch (err) {
      setError('Failed to update logistics. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="logistics-form-overlay">
      <div className="logistics-form-container">
        <div className="logistics-form-header">
          <h3>Edit Transport Logistics Service</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="logistics-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter transport service name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact *</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="e.g., +91-9876543210"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="latitude">Latitude *</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleCoordinateChange}
              step="any"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude *</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleCoordinateChange}
              step="any"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Updating...' : 'Update Transport Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogisticsMap;
