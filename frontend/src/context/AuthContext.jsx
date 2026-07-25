import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session on app mount
    const initializeAuth = async () => {
      try {
        const currentSession = await authService.getCurrentSession();
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          const userProfile = await authService.getUserProfile(currentSession.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error initializing auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Subscribe to real-time auth changes (sign in, sign out, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          const userProfile = await authService.getUserProfile(newSession.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.signIn({ email, password });
      setSession(data.session);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName, email, password) => {
    setLoading(true);
    try {
      const data = await authService.signUp({ fullName, email, password });
      setSession(data.session);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (fullName) => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedProfile = await authService.updateProfile(user.id, fullName);
      setProfile(updatedProfile);
      
      // Fetch fresh session/user to update auth context user info
      const freshUser = await authService.getCurrentUser();
      setUser(freshUser);
      return updatedProfile;
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        token: session?.access_token || null,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
