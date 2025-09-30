import { db } from './config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';

const logisticsCollection = collection(db, 'logistics');

// Add a new logistics point
export const addLogistics = async (logisticsData) => {
  try {
    const logisticsWithTimestamp = {
      ...logisticsData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(logisticsCollection, logisticsWithTimestamp);
    return { id: docRef.id, ...logisticsWithTimestamp };
  } catch (error) {
    console.error("Error adding logistics: ", error);
    throw error;
  }
};

// Get all logistics
export const getLogistics = async () => {
  try {
    const q = query(logisticsCollection, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting logistics: ", error);
    throw error;
  }
};

// Get logistics by ID
export const getLogisticsById = async (id) => {
  try {
    const docRef = doc(db, 'logistics', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Logistics not found");
    }
  } catch (error) {
    console.error("Error getting logistics: ", error);
    throw error;
  }
};

// Update logistics
export const updateLogistics = async (id, logisticsData) => {
  try {
    const docRef = doc(db, 'logistics', id);
    const updateData = {
      ...logisticsData,
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, updateData);
    return { id, ...updateData };
  } catch (error) {
    console.error("Error updating logistics: ", error);
    throw error;
  }
};

// Delete logistics
export const deleteLogistics = async (id) => {
  try {
    const docRef = doc(db, 'logistics', id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting logistics: ", error);
    throw error;
  }
};

// Get logistics within a certain radius of a location
export const getLogisticsNearby = async (centerLat, centerLng, radiusKm = 50) => {
  try {
    const allLogistics = await getLogistics();
    
    // Filter logistics within radius
    const nearbyLogistics = allLogistics.filter(logistics => {
      if (!logistics.latitude || !logistics.longitude) return false;
      
      const distance = calculateDistance(
        centerLat, 
        centerLng, 
        logistics.latitude, 
        logistics.longitude
      );
      
      return distance <= radiusKm;
    });
    
    // Sort by distance
    return nearbyLogistics.sort((a, b) => {
      const distanceA = calculateDistance(centerLat, centerLng, a.latitude, a.longitude);
      const distanceB = calculateDistance(centerLat, centerLng, b.latitude, b.longitude);
      return distanceA - distanceB;
    });
  } catch (error) {
    console.error("Error getting nearby logistics: ", error);
    throw error;
  }
};

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Search logistics by name or type
export const searchLogistics = async (searchTerm) => {
  try {
    const allLogistics = await getLogistics();
    const searchLower = searchTerm.toLowerCase();
    
    return allLogistics.filter(logistics => 
      logistics.name?.toLowerCase().includes(searchLower) ||
      logistics.type?.toLowerCase().includes(searchLower) ||
      logistics.address?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("Error searching logistics: ", error);
    throw error;
  }
};
