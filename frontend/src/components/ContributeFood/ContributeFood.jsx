import React, { useState } from "react";
import { db } from "../../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import "./ContributeFood.css";

const ContributeFood = () => {
  const [formData, setFormData] = useState({
    providerName: '',
    providerType: 'restaurant',
    location: '',
    foodType: '',
    quantity: '',
    unit: 'people',
    contactPerson: '',
    phone: '',
    additionalInfo: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Persist to Firestore
    try {
      await addDoc(collection(db, "foodContributions"), {
        providerName: formData.providerName,
        providerType: formData.providerType,
        location: formData.location,
        foodType: formData.foodType,
        quantity: formData.quantity,
        unit: formData.unit,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        additionalInfo: formData.additionalInfo || "",
        createdAt: serverTimestamp()
      });
    } catch (error) {
      // Optionally surface this to the user; continue to WhatsApp regardless
      console.error("Failed to save contribution to Firestore", error);
    }

    // Create WhatsApp message
    const message = `FOOD CONTRIBUTION REQUEST

Provider Details:
- Name/Entity: ${formData.providerName}
- Type: ${formData.providerType}
- Location: ${formData.location}

Food Details:
- Food Type: ${formData.foodType}
- Quantity: ${formData.quantity} ${formData.unit}

Contact Information:
- Contact Person: ${formData.contactPerson}
- Phone: ${formData.phone}

Additional Information:
${formData.additionalInfo || 'No additional information provided'}

Thank you for contributing to our community!`;

    // Replace with your WhatsApp number (with country code, without + or spaces)
    const whatsappNumber = "917665677520"; // Your WhatsApp number
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="contribute-section">
      <div className="contribute-container">
        <h1 className="contribute-title">Contribute Food</h1>
        <p className="contribute-desc">
          Help us feed those in need! If you have surplus food from your restaurant, event, or any other source, 
          please fill out this form and we'll coordinate the pickup and distribution.
        </p>

        <form className="contribute-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="providerName">
                Provider Name/Entity *
              </label>
              <input
                type="text"
                id="providerName"
                name="providerName"
                className="form-input"
                placeholder="e.g., ABC Restaurant, John's Wedding"
                value={formData.providerName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="providerType">
                Provider Type *
              </label>
              <select
                id="providerType"
                name="providerType"
                className="form-select"
                value={formData.providerType}
                onChange={handleInputChange}
                required
              >
                <option value="restaurant">Restaurant</option>
                <option value="wedding">Wedding</option>
                <option value="corporate_event">Corporate Event</option>
                <option value="community_event">Community Event</option>
                <option value="catering">Catering Service</option>
                <option value="individual">Individual</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">
              Location/Address *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-input"
              placeholder="Full address for food pickup"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="foodType">
              Food Type/Description *
            </label>
            <textarea
              id="foodType"
              name="foodType"
              className="form-textarea"
              placeholder="Describe the type of food (e.g., cooked meals, fresh vegetables, etc.)"
              value={formData.foodType}
              onChange={handleInputChange}
              required
              rows="3"
            />
          </div>

          <div className="form-row-thirds">
            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                name="quantity"
                className="form-input"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit *</label>
              <select
                name="unit"
                className="form-select"
                value={formData.unit}
                onChange={handleInputChange}
              >
                <option value="people">People</option>
                <option value="kg">Kg</option>
                <option value="plates">Plates</option>
                <option value="boxes">Boxes</option>
                <option value="packets">Packets</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="contactPerson">
                Contact Person *
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                className="form-input"
                placeholder="Name of contact person"
                value={formData.contactPerson}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder="Your contact number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="additionalInfo">
              Additional Information
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              className="form-textarea"
              placeholder="Any special instructions, pickup time preferences, or other details..."
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <button type="submit" className="submit-btn">
            Send Details to WhatsApp
          </button>

          <div className="whatsapp-info">
            <div className="whatsapp-title">What happens next?</div>
            <div className="whatsapp-text">
              Your form details will be sent to our WhatsApp. Our team will contact you within 30 minutes to coordinate the food pickup and ensure it reaches those who need it most.
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContributeFood;
