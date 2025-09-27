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
  serverTimestamp 
} from 'firebase/firestore';

const eventsCollection = collection(db, 'events');

// Add a new event
export const addEvent = async (eventData) => {
  try {
    const eventWithTimestamp = {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(eventsCollection, eventWithTimestamp);
    return { id: docRef.id, ...eventWithTimestamp };
  } catch (error) {
    console.error("Error adding event: ", error);
    throw error;
  }
};

// Get all events
export const getEvents = async () => {
  try {
    const q = query(eventsCollection, orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting events: ", error);
    throw error;
  }
};

// Get a single event by ID
export const getEventById = async (id) => {
  try {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Event not found");
    }
  } catch (error) {
    console.error("Error getting event: ", error);
    throw error;
  }
};

// Update an event
export const updateEvent = async (id, eventData) => {
  try {
    const docRef = doc(db, 'events', id);
    const updatedData = {
      ...eventData,
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, updatedData);
    return { id, ...updatedData };
  } catch (error) {
    console.error("Error updating event: ", error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (id) => {
  try {
    const docRef = doc(db, 'events', id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting event: ", error);
    throw error;
  }
};