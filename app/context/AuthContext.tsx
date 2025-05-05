
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import API from '../common/api';
import showToast from '../helper/toast';

type Plant = {
    label: string
    value: number | string
}
type AuthState = {
    token: string | null
    authenticated: boolean | null
    isLoading: boolean
    role: string[] | null
    plants: Plant[] | null
}
export interface AuthProps {
    authState?: AuthState
    onRegister?: (email: string, password: string) => Promise<any>
    onLogin?: any
    onLogout?: any
    setAuthState?: any
}
const AuthContext = createContext<AuthProps>({})

export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<AuthState>({
        token: null, authenticated: null, isLoading: false, role: null, plants: null
    })
    const router = useRouter()
    useEffect(() => {
        const loadToken = async () => {
            try {
                setAuthState((state) => ({ ...state, isLoading: true }))
                const localStorageResult = await SecureStore.getItemAsync(API.tokenKey)
                const { refreshToken } = localStorageResult ? JSON.parse(localStorageResult) : null
                const { data } = await axios.post(API.refreshTokenURL, { refreshToken }) as any
                const { accessToken } = data
                if (accessToken) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                    const userInformationResult = await axios.get(API.user_information_url)
                    const role = userInformationResult.data?.claims?.map((rl: { type: string, value: string }) => rl.value.toLowerCase())
                    const plants: Plant[] | null = userInformationResult.data?.assignedPlant?.map((plant: any) => ({ label: plant.plantName, value: plant.plantId }))
                    setAuthState({
                        role,
                        plants,
                        token: accessToken,
                        authenticated: true,
                        isLoading: false
                    })
                    router.replace("/(main)")
                    showToast("success", "Welcome", "")
                }
                else {
                    console.log("omg1")
                    router.replace("/(auth)/login")
                }
            } catch (e) {
                const error = { error: true, msg: (e as any).response.data.message }
                showToast("error", "Error", "Something went wrong...")
                router.replace("/(auth)/login")
            } finally {
                setAuthState((state) => ({ ...state, isLoading: false }))
            }
        }
        loadToken()
    }, [])
    const onRegister = async (email: string, password: string) => {
        try {
            return await axios.post(API.loginURL, { email, password })
        } catch (e) {
            return { error: true, msg: (e as any).response.data.message }
        }
    }
    const onLogin = async (email: string, password: string) => {
        try {
            setAuthState((state) => ({ ...state, isLoading: true }))
            const { data } = await axios.post(API.loginURL, { email, password })
            const { accessToken, refreshToken } = data
            const token = accessToken
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            await SecureStore.setItemAsync(API.tokenKey, JSON.stringify({ token, refreshToken }))
            const userInformationResult = await axios.get(API.user_information_url)
            const role = userInformationResult.data?.claims?.map((rl: { type: string, value: string }) => rl.value.toLowerCase())
            const plants: Plant[] | null = userInformationResult.data?.assignedPlant?.map((plant: any) => ({ label: plant.plantName, value: plant.plantId }))
            setAuthState((state) => ({
                ...state,
                role,
                plants,
                token,
                authenticated: true,
            }))
            showToast('success', 'Logged in', "")
            return data
        } catch (e: any) {
            showToast('error', 'Error', "Something went wrong...")
            return { error: true, msg: e?.response.data.detail }
        } finally {
            setAuthState((state) => ({ ...state, isLoading: false }))
        }
    }
    const onLogout = async () => {
        try {
            setAuthState((state) => ({ ...state, isLoading: true }))
            await SecureStore.deleteItemAsync(API.tokenKey)
            setAuthState((state) => ({
                ...state,
                role: null,
                token: null,
                authenticated: false,
            }))
            axios.defaults.headers.common['Authorization'] = " "
            showToast('success', 'Logged out', '')
        } catch (e) {
            showToast('error', 'Error', 'Something went wrong...')
            return { error: true, msg: (e as any).response.data.message }
        } finally {
            setAuthState((state) => ({ ...state, isLoading: false }))
        }
    }
    const value: AuthProps = {
        onRegister,
        onLogin,
        onLogout,
        authState,
        setAuthState
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export default AuthProvider
