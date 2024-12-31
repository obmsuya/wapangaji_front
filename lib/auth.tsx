import React from 'react';
import { useContext, createContext, type PropsWithChildren, useState } from 'react';

const AuthContext = createContext<{
    signIn: () => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

// This hook can be used to access the user info.
export function useAuth(p0?: string | null) {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <AuthProvider />');
        }
    }

    return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [isLoading, setIsLoading] = useState(false)
    const [session, setSession] = useState<string | null>(null)

    return (
        <AuthContext.Provider
            value={{
                signIn: () => {
                    // Perform sign-in logic here
                    useAuth('xxx');
                },
                signOut: () => {
                    useAuth(null);
                },
                session,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
