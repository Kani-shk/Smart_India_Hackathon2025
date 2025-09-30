import React, { useState, useEffect } from 'react';
import { addLogistics } from '../../../../Backend/firebase/logisticsService';
import { geocodeAddress, parseCoordinates, isWithinIndia, getCurrentLocation, reverseGeocode } from '../../services/geocodingService';
import './LogisticsForm.css';

interface LogisticsFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialCoordinates?: [number, number] | null;
}

interface FormData {
  name: string;
  type: string;
  address: string;
  coordinates: string;
  contact: string;
  status: string;
}

const LogisticsForm: React.FC<LogisticsFormProps> = ({ onSuccess, onCancel, initialCoordinates = null }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: 'Truck Service',
    address: '',
    coordinates: '',
    contact: '',
    status: 'active'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [coordinateMode, setCoordinateMode] = useState<boolean>(false);

  const logisticsTypes = [
    'Truck Service',
    'Delivery Service',
    'Transport Company',
    'Fleet Management',
    'Logistics Provider',
    'Shipping Service',
    'Cargo Service',
    'Freight Service',
    'Transport Hub',
    'Vehicle Service'
  ];

  useEffect(() => {
    const initializeLocation = async (): Promise<void> => {
      if (initialCoordinates) {
        // Use provided coordinates
        setFormData(prev => ({
          ...prev,
          coordinates: `${initialCoordinates[0]}, ${initialCoordinates[1]}`
        }));
        setCoordinateMode(true);
      } else {
        // Try to get current location
        try {
          const location = await getCurrentLocation();
          setFormData(prev => ({
            ...prev,
            coordinates: `${location.latitude}, ${location.longitude}`
          }));
          setCoordinateMode(true);
          
          // Try to get address from coordinates
          try {
            const reverseResult = await reverseGeocode(location.latitude, location.longitude);
            if (reverseResult) {
              setFormData(prev => ({
                ...prev,
                address: reverseResult.address
              }));
            }
          } catch (err) {
            console.warn('Reverse geocoding failed:', err);
          }
        } catch (err) {
          console.warn('Failed to get current location:', err);
          // Default to Delhi if current location fails
          setFormData(prev => ({
            ...prev,
            coordinates: '28.6139, 77.2090',
            address: 'New Delhi, Delhi, India'
          }));
          setCoordinateMode(true);
        }
      }
    };

    initializeLocation();
  }, [initialCoordinates]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleAddressChange = async (value: string): Promise<void> => {
    setFormData(prev => ({
      ...prev,
      address: value
    }));

    if (value.length > 2 && !coordinateMode) {
      try {
        const suggestions = await geocodeAddress(value);
        if (suggestions && suggestions.length > 0) {
          setAddressSuggestions([suggestions]);
        } else {
          setAddressSuggestions([]);
        }
        setShowSuggestions(true);
      } catch (err) {
        console.warn('Failed to get address suggestions:', err);
      }
    } else {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = async (suggestion: any): Promise<void> => {
    setFormData(prev => ({
      ...prev,
      address: suggestion.display_name,
      latitude: suggestion.latitude.toString(),
      longitude: suggestion.longitude.toString()
    }));
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      coordinates: value
    }));

    // Auto-validate coordinates
    if (value.trim()) {
      const parsed = parseCoordinates(value);
      if (parsed) {
        if (!isWithinIndia(parsed.latitude, parsed.longitude)) {
          setError('Coordinates are outside India');
        } else {
          setError('');
        }
      } else {
        setError('Invalid coordinates format. Use: latitude, longitude');
      }
    } else {
      setError('');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.type.trim()) {
      setError('Type is required');
      return false;
    }
    if (!formData.coordinates.trim()) {
      setError('Coordinates are required');
      return false;
    }

    const parsed = parseCoordinates(formData.coordinates);
    if (!parsed) {
      setError('Invalid coordinates format. Use: latitude, longitude');
      return false;
    }

    if (!isWithinIndia(parsed.latitude, parsed.longitude)) {
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

      const parsed = parseCoordinates(formData.coordinates);
      const logisticsData = {
        name: formData.name.trim(),
        type: formData.type.trim(),
        address: formData.address.trim() || 'Address not provided',
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        contact: formData.contact.trim(),
        status: formData.status
      };

      await addLogistics(logisticsData);
      onSuccess();
    } catch (err) {
      setError('Failed to add logistics. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    setFormData({
      name: '',
      type: 'Truck Service',
      address: '',
      coordinates: '',
      contact: '',
      status: 'active'
    });
    setError('');
    onCancel();
  };

  return (
    <div className="logistics-form-overlay">
      <div className="logistics-form-container">
        <div className="logistics-form-header">
          <h3>Add Transport Logistics Service</h3>
          <button className="close-btn" onClick={handleCancel}>×</button>
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
            <label htmlFor="type">Service Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              {logisticsTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Location (Auto-filled from current location)</label>
            <div className="location-info">
              <span className="location-icon">📍</span>
              <span className="location-text">Using your current location as default</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="coordinates">Coordinates *</label>
            <input
              type="text"
              id="coordinates"
              name="coordinates"
              value={formData.coordinates}
              onChange={handleCoordinateChange}
              placeholder="e.g., 28.6139, 77.2090"
              required
            />
            <div className="coordinate-help">
              <small>Enter latitude and longitude separated by a comma</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address (Optional)</label>
            <div className="address-input-wrapper">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="Enter address (optional)"
              />
              {showSuggestions && addressSuggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {addressSuggestions.map((suggestion, index) => (
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
          </div>


          <div className="form-group">
            <label htmlFor="contact">Contact</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="e.g., +91-9876543210"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Adding...' : 'Add Transport Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogisticsForm;
