import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextData {
    signed: boolean;
    token: string | null;
    signIn(token: string): Promise<void>;
    signOut(): void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storedToken = await AsyncStorage.getItem('@App:token');
            if (storedToken) {
                setToken(storedToken);
            }
            setLoading(false);
        }
        loadStorageData();
    }, []);

    async function signIn(authToken: string) {
        setToken(authToken);
        await AsyncStorage.setItem('@App:token', authToken);
    }

    async function signOut() {
        setToken(null);
        await AsyncStorage.removeItem('@App:token');
    }

    return (
        <AuthContext.Provider value={{
            signed: !!token,
            token,
            signIn,
            signOut,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}