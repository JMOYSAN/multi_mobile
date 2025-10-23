import {
    createContext,
    useContext,
    useCallback,
    useEffect,
    useState,
    useRef,
} from 'react'
import { Appearance } from 'react-native' // Import pour gérer le thème
import {
    login as loginService,
    register as registerService,
    saveUserToStorage,
    loadUserFromStorage,
    clearUserFromStorage,
    updateUserTheme as updateThemeService,
    logout as logoutService,
    refreshToken as refreshTokenService,
    setAccessToken,
    getAccessToken,
} from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [isConnect, setIsConnect] = useState(false)
    const [pending, setPending] = useState(false)
    const [error, setError] = useState('')
    const accessTokenRef = useRef(null)

    const runWithPending = useCallback(async (task) => {
        setPending(true)
        setError('')
        try {
            return await task()
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setPending(false)
        }
    }, [])

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = await loadUserFromStorage()
            if (storedUser) {
                setCurrentUser(storedUser)
                setIsConnect(true)
                refreshAccessToken()
            }
        }
        initAuth()
    }, [])

    const refreshAccessToken = useCallback(async () => {
        try {
            const success = await refreshTokenService()
            if (success) {
                const token = getAccessToken()
                accessTokenRef.current = token
            }
        } catch {
            logout()
        }
    }, [])
    
    useEffect(() => {
        if (currentUser?.theme) {
            const colorScheme = currentUser.theme === 'light' ? 'light' : 'dark'
            console.log('📱 Thème actif:', colorScheme)
        }
    }, [currentUser?.theme])

    const login = useCallback(
        async (username, password) => {
            const data = await runWithPending(() => loginService(username, password))

            setCurrentUser(data.user)
            await saveUserToStorage(data.user, data.accessToken)
            accessTokenRef.current = data.accessToken
            setAccessToken(data.accessToken)
            setIsConnect(true)

            return data.user
        },
        [runWithPending]
    )

    const register = useCallback(
        async (username, password) => {
            const user = await runWithPending(() =>
                registerService(username, password)
            )
            return user
        },
        [runWithPending]
    )

    const logout = useCallback(async () => {
        await logoutService()
        await clearUserFromStorage()
        accessTokenRef.current = null
        setCurrentUser(null)
        setIsConnect(false)
    }, [])

    const toggleTheme = useCallback(async () => {
        if (!currentUser) return
        const newTheme = currentUser.theme === 'dark' ? 'light' : 'dark'
        const updatedUser = await runWithPending(() =>
            updateThemeService(currentUser.id, newTheme)
        )
        setCurrentUser(updatedUser)
        await saveUserToStorage(updatedUser)
    }, [currentUser, runWithPending])

    const value = {
        currentUser,
        setCurrentUser,
        isConnect,
        login,
        register,
        logout,
        toggleTheme,
        pending,
        error,
        accessTokenRef,
        refreshAccessToken,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider')
    }
    return context
}