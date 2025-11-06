import React, {
    createContext,
    useContext,
    useCallback,
    useEffect,
    useState,
    useRef,
} from "react";
import jwtDecode from "jwt-decode";
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
} from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isConnect, setIsConnect] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const accessTokenRef = useRef(null);

    // ---------- WRAPPER ----------
    const runWithPending = useCallback(async (task) => {
        setPending(true);
        setError("");
        try {
            return await task();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setPending(false);
        }
    }, []);

    // ---------- REFRESH TOKEN ----------
    const refreshAccessToken = useCallback(async () => {
        try {
            const success = await refreshTokenService();
            if (success) {
                const token = getAccessToken();
                accessTokenRef.current = token;
            }
        } catch {
            logout();
        }
    }, []);

    // ---------- INIT ----------
    useEffect(() => {
        const initAuth = async () => {
            const storedUser = await loadUserFromStorage();
            if (storedUser) {
                setCurrentUser(storedUser);
                setIsConnect(true);
                await refreshAccessToken();
            }
        };
        initAuth();
    }, [refreshAccessToken]);

    // ---------- LOGIN ----------
    const login = useCallback(
        async (username, password) => {
            const data = await runWithPending(() => loginService(username, password));

            let realUser = data.user;
            try {
                const decoded = jwtDecode(data.accessToken);
                console.log("🔍 Decoded token payload:", decoded);
                realUser = { ...realUser, id: decoded.id, username: decoded.username };
            } catch (err) {
                console.warn("⚠️ Token decode failed, using backend user only",err);
            }

            setCurrentUser(realUser);
            await saveUserToStorage(realUser, data.accessToken);
            accessTokenRef.current = data.accessToken;
            setAccessToken(data.accessToken);
            setIsConnect(true);

            return realUser;
        },
        [runWithPending]
    );

    // ---------- REGISTER ----------
    const register = useCallback(
        async (username, password) => {
            const user = await runWithPending(() =>
                registerService(username, password)
            );
            return user;
        },
        [runWithPending]
    );

    // ---------- LOGOUT ----------
    const logout = useCallback(async () => {
        await logoutService();
        await clearUserFromStorage();
        accessTokenRef.current = null;
        setCurrentUser(null);
        setIsConnect(false);
    }, []);

    // ---------- THEME ----------
    const toggleTheme = useCallback(async () => {
        if (!currentUser) return;
        const newTheme = currentUser.theme === "dark" ? "light" : "dark";
        const updatedUser = await runWithPending(() =>
            updateThemeService(currentUser.id, newTheme)
        );
        setCurrentUser(updatedUser);
        await saveUserToStorage(updatedUser);
    }, [currentUser, runWithPending]);

    useEffect(() => {
        if (currentUser?.theme) {
            const colorScheme = currentUser.theme === "light" ? "light" : "dark";
            console.log("📱 Thème actif:", colorScheme);
        }
    }, [currentUser?.theme]);

    // ---------- VALUE ----------
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
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------- CUSTOM HOOK ----------
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth doit être utilisé dans un AuthProvider");
    return context;
}
