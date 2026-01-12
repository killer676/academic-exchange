import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// List of valid Oman university email domains
const VALID_EDU_DOMAINS = [
    '@squ.edu.om',           // Sultan Qaboos University
    '@gutech.edu.om',        // German University of Technology
    '@utas.edu.om',          // University of Technology and Applied Sciences
    '@nu.edu.om',            // Nizwa University
    '@dhofar.edu.om',        // Dhofar University
    '@uob.edu.om',           // University of Buraimi
    '@soharuni.edu.om',      // Sohar University
    '@mec.edu.om',           // Middle East College
    '@cce.edu.om',           // Caledonian College of Engineering
    '@gulfcollege.edu.om',   // Gulf College
    '@mcbs.edu.om',          // Modern College of Business and Science
];

// Email domain validation for Omani educational institutions
export const isValidEduEmail = (email: string): boolean => {
    const lowerEmail = email.toLowerCase();
    return VALID_EDU_DOMAINS.some(domain => lowerEmail.endsWith(domain)) || lowerEmail.endsWith('.edu.om');
};
