import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Eye, EyeOff, Lock, User, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', password: '' })
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const validate = () => {
        const e = {}
        if (!form.username.trim()) e.username = 'Username is required'
        if (!form.password) e.password = 'Password is required'
        else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
        setErrors(e)
        return !Object.keys(e).length
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        try {
            await login(form)
            toast.success('Welcome back! 👋')
            navigate('/dashboard')
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid credentials'
            toast.error(msg)
            setErrors({ form: msg })
        } finally {
            setLoading(false)
        }
    }

    const fillDemo = (role) => {
        if (role === 'admin') setForm({ username: 'admin', password: 'admin123' })
        else setForm({ username: 'user', password: 'user123' })
        setErrors({})
    }

    return (
        <div className="login-page">
            {/* Animated Background Orbs */}
            <div style={{
                position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
            }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: `${150 + i * 80}px`,
                        height: `${150 + i * 80}px`,
                        background: `radial-gradient(circle, rgba(${i % 2 === 0 ? '99,102,241' : '139,92,246'},0.08) 0%, transparent 70%)`,
                        top: `${10 + i * 18}%`,
                        left: `${5 + i * 22}%`,
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        animation: `float${i} ${8 + i * 2}s ease-in-out infinite alternate`,
                    }} />
                ))}
            </div>

            <div className="login-card">
                {/* Logo */}
                <div className="login-logo">
                    <Briefcase size={30} color="#fff" />
                </div>

                <h1 className="login-title">
                    Welcome Back <span style={{ display: 'inline-block', animation: 'bounce 2s ease-in-out infinite' }}>👋</span>
                </h1>
                <p className="login-subtitle">Sign in to your Employee Management Portal</p>

                {/* Demo Quick Fill */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => fillDemo('admin')}
                        style={{ fontSize: '0.75rem', gap: '0.3rem' }}
                    >
                        <Sparkles size={12} /> Demo Admin
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => fillDemo('user')}
                        style={{ fontSize: '0.75rem', gap: '0.3rem' }}
                    >
                        <Sparkles size={12} /> Demo User
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={16} style={{
                                position: 'absolute', left: '0.875rem', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none'
                            }} />
                            <input
                                id="login-username"
                                type="text"
                                className={`form-control ${errors.username ? 'error' : ''}`}
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="Enter your username"
                                value={form.username}
                                onChange={e => { setForm(p => ({ ...p, username: e.target.value })); setErrors(p => ({ ...p, username: '' })) }}
                                autoComplete="username"
                                autoFocus
                            />
                        </div>
                        {errors.username && <span className="form-error">{errors.username}</span>}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{
                                position: 'absolute', left: '0.875rem', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none'
                            }} />
                            <input
                                id="login-password"
                                type={showPass ? 'text' : 'password'}
                                className={`form-control ${errors.password ? 'error' : ''}`}
                                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: '' })) }}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(p => !p)}
                                style={{
                                    position: 'absolute', right: '0.875rem', top: '50%',
                                    transform: 'translateY(-50%)', background: 'none', border: 'none',
                                    cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
                                }}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && <span className="form-error">{errors.password}</span>}
                    </div>

                    {errors.form && (
                        <div style={{
                            background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
                            borderRadius: '8px', padding: '0.75rem 1rem', color: '#f43f5e',
                            fontSize: '0.875rem', marginBottom: '1rem'
                        }}>
                            {errors.form}
                        </div>
                    )}

                    <button
                        id="login-submit-btn"
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <p>Secured with JWT Authentication 🔒</p>
                </div>
            </div>

            <style>{`
        @keyframes float0 { from { transform: translateY(0) rotate(0deg); } to { transform: translateY(-20px) rotate(5deg); } }
        @keyframes float1 { from { transform: translateY(0) rotate(0deg); } to { transform: translateY(-30px) rotate(-5deg); } }
        @keyframes float2 { from { transform: translateY(0) rotate(0deg); } to { transform: translateY(-15px) rotate(3deg); } }
        @keyframes float3 { from { transform: translateY(0) rotate(0deg); } to { transform: translateY(-25px) rotate(-3deg); } }
        @keyframes float4 { from { transform: translateY(0) rotate(0deg); } to { transform: translateY(-10px) rotate(2deg); } }
      `}</style>
        </div>
    )
}
