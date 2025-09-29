// Sample logistics data for testing the logistics map
// Run this script to populate Firebase with sample logistics data

import { addLogistics } from './logisticsService';

const sampleLogisticsData = [
  {
    name: "Delhi Transport Services",
    type: "Truck Service",
    address: "Connaught Place, New Delhi, Delhi 110001",
    latitude: 28.6315,
    longitude: 77.2167,
    contact: "+91-9876543210",
    status: "active"
  },
  {
    name: "Mumbai Cargo Services",
    type: "Cargo Service",
    address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
    latitude: 19.0596,
    longitude: 72.8295,
    contact: "+91-9876543211",
    status: "active"
  },
  {
    name: "Bangalore Delivery Network",
    type: "Delivery Service",
    address: "MG Road, Bangalore, Karnataka 560001",
    latitude: 12.9716,
    longitude: 77.5946,
    contact: "+91-9876543212",
    status: "active"
  },
  {
    name: "Kolkata Transport Co.",
    type: "Transport Company",
    address: "Park Street, Kolkata, West Bengal 700016",
    latitude: 22.5726,
    longitude: 88.3639,
    contact: "+91-9876543213",
    status: "active"
  },
  {
    name: "Chennai Fleet Management",
    type: "Fleet Management",
    address: "Anna Salai, Chennai, Tamil Nadu 600002",
    latitude: 13.0827,
    longitude: 80.2707,
    contact: "+91-9876543214",
    status: "active"
  },
  {
    name: "Hyderabad Logistics Provider",
    type: "Logistics Provider",
    address: "Banjara Hills, Hyderabad, Telangana 500034",
    latitude: 17.3850,
    longitude: 78.4867,
    contact: "+91-9876543215",
    status: "active"
  },
  {
    name: "Pune Shipping Services",
    type: "Shipping Service",
    address: "Koregaon Park, Pune, Maharashtra 411001",
    latitude: 18.5204,
    longitude: 73.8567,
    contact: "+91-9876543216",
    status: "active"
  },
  {
    name: "Ahmedabad Freight Co.",
    type: "Freight Service",
    address: "C.G. Road, Ahmedabad, Gujarat 380009",
    latitude: 23.0225,
    longitude: 72.5714,
    contact: "+91-9876543217",
    status: "active"
  },
  {
    name: "Jaipur Transport Hub",
    type: "Transport Hub",
    address: "C-Scheme, Jaipur, Rajasthan 302001",
    latitude: 26.9124,
    longitude: 75.7873,
    contact: "+91-9876543218",
    status: "active"
  },
  {
    name: "Lucknow Vehicle Services",
    type: "Vehicle Service",
    address: "Hazratganj, Lucknow, Uttar Pradesh 226001",
    latitude: 26.8467,
    longitude: 80.9462,
    contact: "+91-9876543219",
    status: "active"
  }
];

// Function to populate sample data
export const populateSampleData = async () => {
  try {
    console.log('Adding sample logistics data...');
    
    for (const logistics of sampleLogisticsData) {
      await addLogistics(logistics);
      console.log(`Added: ${logistics.name}`);
    }
    
    console.log('Sample logistics data added successfully!');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
};

// Uncomment the line below to run the population script
// populateSampleData();
