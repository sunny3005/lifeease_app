
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Register function
  async function register(email, password, displayName, phoneNumber) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      displayName,
      phoneNumber: phoneNumber || '',
      photoURL: '',
      createdAt: new Date().toISOString()
    });
    
    return userCredential;
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Update user profile
  async function updateUserProfile(updates) {
    if (!currentUser) throw new Error('No user logged in');

    const userDocRef = doc(db, 'users', currentUser.uid);
    
    // Update Firebase Auth profile if displayName changed
    if (updates.displayName && updates.displayName !== currentUser.displayName) {
      await updateProfile(currentUser, { displayName: updates.displayName });
    }
    
    // Update email if changed
    if (updates.email && updates.email !== currentUser.email) {
      await updateEmail(currentUser, updates.email);
    }
    
    // Update photo URL if provided
    if (updates.photoURL) {
      await updateProfile(currentUser, { photoURL: updates.photoURL });
    }
    
    // Update Firestore document
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    // Refresh user profile
    await fetchUserProfile(currentUser.uid);
  }

  // Upload profile photo
  async function uploadProfilePhoto(file) {
    if (!currentUser || !file) return null;
    
    const photoRef = ref(storage, `profile-photos/${currentUser.uid}`);
    await uploadBytes(photoRef, file);
    const downloadURL = await getDownloadURL(photoRef);
    
    return downloadURL;
  }

  // Fetch user profile from Firestore
  async function fetchUserProfile(uid) {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      setUserProfile(userDoc.data());
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    register,
    login,
    logout,
    updateUserProfile,
    uploadProfilePhoto
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
