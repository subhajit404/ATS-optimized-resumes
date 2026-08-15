import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return { success: true, user: data.user }
        } catch (err) {
            const message = 
                err.response?.data?.message || 
                (err.response?.status === 500 
                    ? "Server error (500). Please check that the backend server is running and database is connected." 
                    : (err.message || "Login failed"))
            return { success: false, error: message }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return { success: true, user: data.user }
        } catch (err) {
            const message = 
                err.response?.data?.message || 
                (err.response?.status === 500 
                    ? "Server error (500). Please check that the backend server is running and database is connected." 
                    : (err.message || "Registration failed"))
            return { success: false, error: message }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
            return { success: true }
        } catch (err) {
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, handleRegister, handleLogin, handleLogout }
}