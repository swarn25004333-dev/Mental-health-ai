import { supabase } from '../lib/supabase';

/**
 * Authentication service wrapping Supabase Auth operations.
 */
export const authService = {
  /**
   * Register a new user with Supabase Auth.
   */
  async signUp({ email, password, fullName }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        // Use the site where the signup happened, instead of Supabase's
        // default Site URL (which might still be localhost during development).
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Log in an existing user with Email & Password.
   */
  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Log out the currently authenticated user.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current active session.
   */
  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get the currently authenticated user details.
   */
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  /**
   * Fetch the corresponding profile record from the `profiles` table.
   */
  async getUserProfile(userId) {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error);
    }
    return data;
  },

  /**
   * Update the user profile details (full name).
   */
  async updateProfile(userId, fullName) {
    if (!userId) throw new Error('User ID is required');

    // 1. Update auth user metadata
    const { data: authData, error: authError } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    if (authError) throw authError;

    // 2. Update profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: userId, full_name: fullName, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (profileError) {
      console.warn('⚠️ profiles table update failed (might be normal if RLS policies are strict):', profileError);
    }

    return profileData || authData.user;
  },
};
