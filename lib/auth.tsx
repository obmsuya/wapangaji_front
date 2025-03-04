// /context/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export interface User {
    id: number,
    phone_number: string,
    full_name: string,
    language: string,
    date_joined: Date,
    last_login: any | null
}

// Define types for auth context
interface AuthContextType {
    user: User | null
    access: string | null;
    refresh: string | null;
    login: (phone_number: string, password: string) => Promise<void>;
    register: (phone_number: string, full_name: string, password: string) => Promise<void>;
    resetPassword: (phone_number: string, new_password: string, confirm_password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [access, setAccess] = useState<string | null>(null);
    const [refresh, setRefresh] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    // Load tokens from AsyncStorage on app start
    useEffect(() => {
        const loadStoredTokens = async () => {
            const [access, refresh] = await Promise.all([
                AsyncStorage.getItem('access'),
                AsyncStorage.getItem('refresh'),
            ]);

            if (access && refresh) {
                setAccess(access);
                setRefresh(refresh);
                setIsAuthenticated(true);
            }
        };

        loadStoredTokens();
    }, []);

    const login = async (phone_number: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await api.post('auth/login/', { phone_number, password });

            const { access, refresh } = response.data;
            console.log(access);

            // Store tokens in state and AsyncStorage
            setAccess(access);
            setRefresh(refresh);
            setIsAuthenticated(true);


            await AsyncStorage.setItem('access', access);
            await AsyncStorage.setItem('refresh', refresh);

            router.replace('(user)')

            Toast.show({
                type: "success",
                text1: "Login Successful!",
                text2: "You have successfully logged in."
            });

            await getUser()

        } catch (error: any) {
            console.error('Login failed:', error.response.data);
            Toast.show({
                type: "error",
                text1: "Login Failed!",
                text2: `${error.response.data.error ?? error.response.data.phone_number ?? "Something went wrong" }`
            });
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (phone_number: string, full_name: string, password: string) => {
        setIsLoading(true);
        try {
            // const response = await api.post('auth/register/', { phone_number, full_name, password });
            // const { access, refresh } = response.data;

            // // Store tokens in state and AsyncStorage
            // setAccess(access);
            // setRefresh(refresh);
            // setIsAuthenticated(true);

            // await AsyncStorage.setItem('access', access);
            // await AsyncStorage.setItem('refresh', refresh);

            router.replace('(user)/(property)/add-property')

            Toast.show({
                type: "success",
                text1: "Registration Successful!",
                text2: "Welcome to Wapangaji Kiganjani."
            });
            await getUser()
        } catch (error: any) {
            console.log('Registration failed:', error.response.data.error);
            Toast.show({
                type: "error",
                text1: "Registration Failed!",
                text2: `${error.response.data.error ?? "Something went wrong" }`
            });
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await api.post("auth/logout/")
            await AsyncStorage.removeItem('access');
            await AsyncStorage.removeItem('refresh');
            setAccess(null);
            setRefresh(null);
            setIsAuthenticated(false);
            setUser(null)
            router.push('/(auth)/');
        } catch (error: any) {
            await AsyncStorage.removeItem('access');
            await AsyncStorage.removeItem('refresh');
            setAccess(null);
            setRefresh(null);
            setIsAuthenticated(false);
            setUser(null)
            router.push('/(auth)/');
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    };

    const resetPassword = async (phone_number: string, new_password: string, confirm_password: string) => {
        setIsLoading(true);
        try {
            const response = await api.post('auth/password-reset/', { phone_number, new_password, confirm_password })
            console.log(response)
            Toast.show({
                type: "success",
                text1: "Password Reset Successful!",
                text2: "You have successfully reset your password."
            });
        } catch (error: any) {
            console.log("Failed to reset password", error)
            Toast.show({
                type: "error",
                text1: "Failed to reset password",
                text2: error?.error ? error?.error : `Something went wrong. Please try again.`
            });
        } finally {
            setIsLoading(false);
        }
    }

    const getUser = async () => {
        setIsLoading(true)
        try {
            const res: User | any = await api.get("auth/me/")
            setUser(res?.data)
        } catch (error: any) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthContext.Provider
            value={{ access, refresh, login, register, resetPassword, logout, isAuthenticated, isLoading, user }}
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
