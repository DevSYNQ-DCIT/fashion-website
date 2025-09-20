import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Types and interfaces
export type UserRole = 'user' | 'admin';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
}

type AuthUser = {
    id: string;
    email: string;
    user_metadata: {
        full_name?: string;
        avatar_url?: string;
    };
    created_at: string;
    updated_at: string;
};

export interface SignUpResponse {
    success: boolean;
    message: string;
    data: any;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    login: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<SignUpResponse>;
    resendVerification: (email: string) => Promise<{ success: boolean; message: string }>;
    signInWithGoogle: () => Promise<void>;
    signInWithGitHub: () => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    isLoading: boolean;
    isAdmin: () => boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AuthProvider component
const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Helper function to fetch user profile
    const fetchUserProfile = useCallback(async (userId: string) => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
                console.error('Error fetching user profile:', error);
                throw error;
            }

            return profile;
        } catch (error) {
            console.error('Error in fetchUserProfile:', error);
            throw error;
        }
    }, []);

    // Handle auth state changes
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session) {
                    setSession(session);

                    // For password reset flow
                    if (window.location.pathname === '/reset-password') {
                        setUser({
                            id: session.user.id,
                            email: session.user.email!,
                            name: 'User',
                            role: 'user'
                        });
                        setIsLoading(false);
                        return;
                    }

                    try {
                        // First try to get the user's profile
                        let profile = await fetchUserProfile(session.user.id);
                        
                        // If no profile exists and this is a new user (SIGNED_UP event or first login after email verification)
                        if (!profile && (event === 'SIGNED_UP' || event === 'SIGNED_IN')) {
                            console.log('Creating new profile for user:', session.user.id);
                            
                            const { data: newProfile, error: profileError } = await supabase
                                .from('profiles')
                                .upsert({
                                    id: session.user.id,
                                    email: session.user.email?.toLowerCase().trim(),
                                    full_name: session.user.user_metadata?.full_name?.trim() || 'User',
                                    role: 'user',
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString()
                                })
                                .select()
                                .single();
                                
                            if (profileError) {
                                console.error('Error creating profile:', profileError);
                                throw profileError;
                            }
                            
                            profile = newProfile;
                            console.log('Profile created successfully:', profile);
                        }
                        
                        // Update user state with profile data
                        setUser({
                            id: session.user.id,
                            email: session.user.email!,
                            name: profile?.full_name || session.user.user_metadata?.full_name || 'User',
                            role: (profile?.role as UserRole) || 'user',
                            avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
                            created_at: profile?.created_at,
                            updated_at: profile?.updated_at
                        });
                    } catch (error) {
                        console.error('Error handling auth state change:', error);
                    }
                } else {
                    setSession(null);
                    setUser(null);
                }
                setIsLoading(false);
            }
        );

        // Initial session check
        const checkSession = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                if (currentSession) {
                    const profile = await fetchUserProfile(currentSession.user.id);
                    setSession(currentSession);
                    setUser({
                        id: currentSession.user.id,
                        email: currentSession.user.email!,
                        name: profile?.full_name || currentSession.user.user_metadata?.full_name || 'User',
                        role: (profile?.role as UserRole) || 'user',
                        avatar_url: profile?.avatar_url || currentSession.user.user_metadata?.avatar_url,
                        created_at: profile?.created_at,
                        updated_at: profile?.updated_at
                    });
                }
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchUserProfile]);

    // Auth methods will be implemented here
    const signUp = async (email: string, password: string, name: string): Promise<SignUpResponse> => {
        setIsLoading(true);
        console.log('Starting signup process...', { email, name });
        
        try {
            // 1. Sign up the user with Supabase Auth
            console.log('Attempting to create auth user...');
            
            const signUpPayload = {
                email: email.toLowerCase().trim(),
                password: password.trim(),
                options: {
                    data: {
                        full_name: name.trim(),
                        email: email.toLowerCase().trim(),
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            };
            
            console.log('Signup payload (sanitized):', {
                ...signUpPayload,
                password: '***',
                options: {
                    ...signUpPayload.options,
                    data: {
                        ...signUpPayload.options.data,
                        email: signUpPayload.options.data.email ? '***@***' : 'missing'
                    }
                }
            });

            // Make the signup request
            const { data, error } = await supabase.auth.signUp(signUpPayload);

            if (error) {
                console.error('Auth signup error:', {
                    name: error.name,
                    message: error.message,
                    status: error.status,
                });

                // Handle specific error cases
                if (error.message.includes('already registered')) {
                    throw new Error('This email is already registered. Please sign in instead.');
                } else if (error.message.includes('password')) {
                    throw new Error('Invalid password. Please use a stronger password.');
                } else if (error.message.includes('email')) {
                    throw new Error('Invalid email address. Please check and try again.');
                }
                
                throw new Error('Unable to create account. Please try again later.');
            }

            console.log('Auth user created:', { userId: data.user?.id });

            // Return success - the profile will be created when the user verifies their email
            return {
                success: true,
                message: 'A confirmation email has been sent. Please check your email to verify your account.',
                data: {
                    ...data,
                    requiresConfirmation: true
                }
            };
            
        } catch (error: any) {
            console.error('Signup process failed:', {
                name: error.name,
                message: error.message,
                stack: error.stack,
            });
            
            throw error;
            
        } finally {
            console.log('Signup process completed');
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `http://localhost:8080/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    };

    const signInWithGitHub = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `http://localhost:8080/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error signing in with GitHub:', error);
            throw error;
        }
    };

    const resendVerification = async (email: string) => {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
                options: {
                    emailRedirectTo: `http://localhost:8080/auth/callback`,
                },
            });

            if (error) throw error;

            return {
                success: true,
                message: 'Verification email resent successfully!',
            };
        } catch (error: any) {
            console.error('Error resending verification email:', error);
            return {
                success: false,
                message: error.message || 'Failed to resend verification email',
            };
        }
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `http://localhost:8080/reset-password`,
        });
        if (error) throw error;
    };

    const updatePassword = async (newPassword: string) => {
      try {
        // No need for session — Supabase reads token from URL automatically
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          console.error('Password update error:', error);
          if (error.message.includes('invalid_grant') || error.message.includes('Auth session missing')) {
            throw new Error('The password reset link is invalid or has expired. Please request a new one.');
          }
          throw new Error(error.message || 'Failed to update password');
        }

        return { success: true, message: 'Password updated successfully' };
      } catch (error: any) {
        console.error('Error in updatePassword:', error);
        throw error;
      }
    };

    const logout = async () => {
        try {
            // Clear local state first
            setUser(null);
            setSession(null);

            // Sign out from Supabase
            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            // Force a hard reload to clear any remaining state
            window.location.href = '/login';

            return true;
        } catch (error) {
            console.error('Error signing out:', error);
            // Even if there's an error, we should still clear local state
            setUser(null);
            setSession(null);
            window.location.href = '/login';
            return false;
        }
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const value = {
        user,
        session,
        isLoading,
        login,
        signUp,
        logout,
        signInWithGoogle,
        signInWithGitHub,
        resetPassword,
        updatePassword,
        resendVerification,
        isAdmin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the hook with a proper name that starts with 'use'
const useAuthContext = useAuth;

// Export the hook as default for better compatibility
export default useAuthContext;

// Named exports
export { AuthProvider, useAuthContext as useAuth };