'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

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

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const refetch = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/me', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const signOut = useCallback(async () => {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        setUser(null);
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <AuthContext.Provider value={{ user, isSignedIn: !!user, isLoaded, refetch, signOut }}>
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
