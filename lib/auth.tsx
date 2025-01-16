// /context/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

// Define types for auth context
interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (phone_number: string, password: string) => Promise<void>;
    register: (phone_number: string, full_name: string, password: string, language: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    // Load tokens from AsyncStorage on app start
    useEffect(() => {
        const loadStoredTokens = async () => {
            const [storedAccessToken, storedRefreshToken] = await Promise.all([
                AsyncStorage.getItem('accessToken'),
                AsyncStorage.getItem('refreshToken'),
            ]);

            if (storedAccessToken && storedRefreshToken) {
                setAccessToken(storedAccessToken);
                setRefreshToken(storedRefreshToken);
                setIsAuthenticated(true);
            }
        };

        loadStoredTokens();
    }, []);

    const login = async (phone_number: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await api.post('auth/login/', { phone_number, password });
            const res = response.data;

            console.log(res);
            const { access, refresh } = response.data;

            // Store tokens in state and AsyncStorage
            setAccessToken(access);
            setRefreshToken(refresh);
            setIsAuthenticated(true);


            await AsyncStorage.setItem('accessToken', access);
            await AsyncStorage.setItem('refreshToken', refresh);

            router.replace('(user)')

            Toast.show({
                type: "success",
                text1: "Login Successful!",
                text2: "You have successfully logged in."
            });
        } catch (error: any) {
            console.error('Login failed:', error);
            Toast.show({
                type: "error",
                text1: "Login Failed!",
                text2: `Something went wrong. Please try again.`
            });
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (phone_number: string, full_name: string, password: string, language: string) => {
        setIsLoading(true);
        try {
            const response = await api.post('auth/register/', { phone_number, full_name, password, language });
            const { access, refresh } = response.data;

            // Store tokens in state and AsyncStorage
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setIsAuthenticated(true);

            await AsyncStorage.setItem('accessToken', access);
            await AsyncStorage.setItem('refreshToken', refresh);

            router.replace('(user)')

            Toast.show({
                type: "success",
                text1: "Login Successful!",
                text2: "You have successfully registered in."
            });
        } catch (error: any) {
            console.error('Login failed:', error);
            Toast.show({
                type: "error",
                text1: "Login Failed!",
                text2: error?.description ? error?.description : `Something went wrong. Please try again.`
            });
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        setAccessToken(null);
        setRefreshToken(null);
        setIsAuthenticated(false);
        router.push('/(auth)/');
    };

    return (
        <AuthContext.Provider
            value={{ accessToken, refreshToken, login, register, logout, isAuthenticated, isLoading }}
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
