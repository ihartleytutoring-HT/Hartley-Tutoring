import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isPreApprovedAdmin } from '../firebase/config';
import { UserProfile, UserRole } from '../types';
import { handleFirestoreError, OperationType } from '../firebase/errors';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  simulateAdminMode: (enable: boolean) => void;
  isSimulatedAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSimulatedAdmin, setIsSimulatedAdmin] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const email = currentUser.email || '';
        const isAdminEmail = isPreApprovedAdmin(email);
        const determinedRole: UserRole = isAdminEmail ? 'admin' : 'student';

        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            // If the user's email is in pre-approved admin list, prioritize admin
            const finalRole: UserRole = isAdminEmail || data.role === 'admin' ? 'admin' : 'student';
            setProfile({
              ...data,
              role: finalRole,
              displayName: currentUser.displayName || data.displayName || 'Student',
              photoURL: currentUser.photoURL || data.photoURL,
            });
          } else {
            const newProfile: UserProfile = {
              id: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Student',
              photoURL: currentUser.photoURL || undefined,
              role: determinedRole,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          console.warn('Could not sync user profile to Firestore:', error);
          // Set fallback local profile
          setProfile({
            id: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'Student',
            photoURL: currentUser.photoURL || undefined,
            role: determinedRole,
          });
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<User | null> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        console.error('Google Sign In failed:', error);
        alert('Could not sign in with Google: ' + (error?.message || 'Unknown error'));
      }
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setProfile(null);
      setIsSimulatedAdmin(false);
    } catch (error) {
      console.error('Sign Out failed:', error);
    }
  };

  const simulateAdminMode = (enable: boolean) => {
    setIsSimulatedAdmin(enable);
  };

  const effectiveIsAdmin =
    isSimulatedAdmin ||
    Boolean(
      profile?.role === 'admin' ||
      isPreApprovedAdmin(user?.email)
    );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin: effectiveIsAdmin,
        loading,
        loginWithGoogle,
        logout,
        simulateAdminMode,
        isSimulatedAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
