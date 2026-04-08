'use client';

import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export type AuthUser = {
    id: string;
    email: string;
    name: string;
};

type AuthContextType = {
    user: AuthUser | null;
    isSignedIn: boolean;
    isLoaded: boolean;
    refetch: () => Promise<void>;
    signOut: () => Promise<void>;
};

const MOCK_USER: AuthUser = {
    id: 'mock-user-1',
    email: 'user@example.com',
    name: 'Demo User',
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user] = useState<AuthUser | null>(MOCK_USER);

    const refetch = useCallback(async () => {}, []);
    const signOut = useCallback(async () => {}, []);

    return (
        <AuthContext.Provider value={{ user, isSignedIn: true, isLoaded: true, refetch, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuthContext(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
    return ctx;
}

export function useAuth() {
    const { isSignedIn, isLoaded, user } = useAuthContext();
    return { isSignedIn, isLoaded, userId: user?.id ?? null };
}

export function useUser() {
    const { isSignedIn, user } = useAuthContext();
    return {
        isSignedIn,
        user: user
            ? {
                  id: user.id,
                  fullName: user.name,
                  firstName: user.name.split(' ')[0],
                  emailAddresses: [{ emailAddress: user.email }],
                  imageUrl: null as string | null,
                  hasImage: false,
              }
            : null,
    };
}

export function useClerk() {
    const { signOut, user } = useAuthContext();
    return {
        signOut,
        openUserProfile: () => {},
        user,
    };
}

export function useAuthFull() {
    return useAuthContext();
}
