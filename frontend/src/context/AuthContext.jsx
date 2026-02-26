import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/services'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        if (savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    }, [])

    const login = async (credentials) => {
        const response = await authAPI.login(credentials)
        const { data } = response.data
        setToken(data.token)
        setUser({ id: data.id, username: data.username, email: data.email, role: data.role })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify({ id: data.id, username: data.username, email: data.email, role: data.role }))
        return data
    }

    const logout = async () => {
        try { await authAPI.logout() } catch { }
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        toast.success('Logged out successfully')
    }

    const isAdmin = () => user?.role === 'ADMIN'

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
