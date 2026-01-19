'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSessionSecurity } from '@/hooks/useSessionSecurity';
import {
    User as FirebaseUser,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendEmailVerification,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isValidEduEmail } from '@/lib/firebase';
import { User } from '@/types';

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    firebaseUser: null,
    loading: true,
    signUp: async () => { },
    signIn: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setFirebaseUser(firebaseUser);

            if (firebaseUser /* FAMILY TESTING MODE: Disabled emailVerified check */ /* && firebaseUser.emailVerified */) {
                // Fetch user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    // Convert Firestore Timestamp to Date if needed
                    const user: User = {
                        ...userData,
                        createdAt: userData.createdAt?.toDate ? userData.createdAt.toDate() : (userData.createdAt || new Date()),
                    } as User;
                    setUser(user);
                } else {
                    // Create initial user document
                    const newUser: User = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
                        photoURL: firebaseUser.photoURL,
                        phoneNumber: firebaseUser.phoneNumber,
                        university: '',
                        isVerifiedStudent: isValidEduEmail(firebaseUser.email || ''),
                        createdAt: new Date(),
                    };

                    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
                    setUser(newUser);
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signUp = async (email: string, password: string) => {
        try {
            // FAMILY TESTING MODE: Disabled university email validation
            // if (!isValidEduEmail(email)) {
            //     throw new Error('Please use your university email');
            // }

            // Create account
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // FAMILY TESTING MODE: Skip email verification
            // await sendEmailVerification(userCredential.user);

            // FAMILY TESTING MODE: Don't sign out - let them in immediately
            // await firebaseSignOut(auth);
        } catch (error: any) {
            console.error('Sign up error:', error);
            throw error;
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Reload user to get the latest emailVerified status
            await userCredential.user.reload();

            // FAMILY TESTING MODE: Disabled email verification check
            // const currentUser = auth.currentUser;
            // if (!currentUser || !currentUser.emailVerified) {
            //     await firebaseSignOut(auth);
            //     throw new Error('Please verify your email first by clicking the link sent to your inbox.');
            // }

            // If we reach here, user can proceed
        } catch (error: any) {
            console.error('Sign in error:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    // Session security callbacks
    const handleSessionTimeout = useCallback(async () => {
        console.log('[Security] User logged out due to inactivity');
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Session timeout sign out error:', error);
        }
    }, []);

    const handlePageClose = useCallback(async () => {
        console.log('[Security] User logged out due to page close');
        try {
            // Use synchronous signOut for beforeunload event
            firebaseSignOut(auth);
        } catch (error) {
            console.error('Page close sign out error:', error);
        }
    }, []);

    // Enable session security when user is logged in
    useSessionSecurity({
        onTimeout: handleSessionTimeout,
        onPageClose: handlePageClose,
        enabled: !!user && !loading,
    });

    return (
        <AuthContext.Provider value={{ user, firebaseUser, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

