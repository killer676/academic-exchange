import { signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { isValidEduEmail } from './firebase';
import { User } from '@/types';

/**
 * Sign in with Google and verify .edu.om email
 */
export async function signInWithGoogle(): Promise<{ user: User | null; error: string | null }> {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        // Verify email domain
        if (!firebaseUser.email || !isValidEduEmail(firebaseUser.email)) {
            // Sign out if email is not valid
            await signOut(auth);
            return {
                user: null,
                error: 'Please use a university email address (.edu.om) to sign in.',
            };
        }

        // Check if user exists in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Create new user document
            const newUser: Omit<User, 'uid'> = {
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || 'Student',
                photoURL: firebaseUser.photoURL,
                phoneNumber: firebaseUser.phoneNumber || null,
                university: '', // Will be set in profile
                isVerifiedStudent: true,
                createdAt: new Date(),
            };

            await setDoc(userRef, {
                ...newUser,
                createdAt: serverTimestamp(),
            });
        }

        // Fetch and return user data
        const userData = userSnap.exists() ? userSnap.data() : {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Student',
            photoURL: firebaseUser.photoURL,
            phoneNumber: firebaseUser.phoneNumber || null,
            university: '',
            isVerifiedStudent: true,
            createdAt: new Date(),
        };

        return {
            user: {
                uid: firebaseUser.uid,
                ...userData,
                createdAt: userData.createdAt?.toDate() || new Date(),
            } as User,
            error: null,
        };
    } catch (error: any) {
        console.error('Error signing in with Google:', error);
        return {
            user: null,
            error: error.message || 'Failed to sign in. Please try again.',
        };
    }
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
    await signOut(auth);
}

/**
 * Get current user from Firebase Auth
 */
export function getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
}
