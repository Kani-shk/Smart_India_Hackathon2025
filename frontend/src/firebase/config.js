// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3e3f7n9i1zRinFNllHBHX37Wy3oJFP5M",
    authDomain: "shareplate-6c94a.firebaseapp.com",
    projectId: "shareplate-6c94a",
    storageBucket: "shareplate-6c94a.appspot.com", // fixed
    messagingSenderId: "192016083882",
    appId: "1:192016083882:web:c98181d910b6aaf2d419d3",
    measurementId: "G-HXE8SLTJ9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
