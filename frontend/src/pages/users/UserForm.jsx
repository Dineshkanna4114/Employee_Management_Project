import { useState, useEffect } from 'react'
import { X, Save, User as UserIcon, Mail, Lock, CheckCircle2, Circle, ShieldCheck, ShieldAlert } from 'lucide-react'

export default function UserForm({ isOpen, onClose, onSubmit, initialData, loading }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'USER',
        enabled: true
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (initialData) {
            setFormData({
                username: initialData.username || '',
                email: initialData.email || '',
                password: '',
                role: initialData.role || 'USER',
                enabled: initialData.enabled ?? true
            })
        } else {
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'USER',
                enabled: true
            })
        }
        setErrors({})
    }, [initialData, isOpen])

    const validate = () => {
        const newErrors = {}
        if (!formData.username) newErrors.username = 'Username is required'
        if (!formData.email) newErrors.email = 'Email is required'
        if (!initialData && !formData.password) newErrors.password = 'Password is required'
        if (formData.password && formData.password.length > 0 && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            onSubmit(formData)
        }
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay" style={{ alignItems: 'flex-start', paddingTop: '5vh' }}>
            <div className="modal" style={{
                maxWidth: '550px',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <div className="modal-header" style={{ flexShrink: 0, padding: '1.25rem 1.5rem' }}>
                    <div>
                        <h2 className="modal-title">{initialData ? 'Edit User Profile' : 'Create New User'}</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {initialData ? 'Update account details and permissions' : 'Set up portal access for a new member'}
                        </p>
                    </div>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        style={{
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            transition: 'var(--transition)',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                    <div className="modal-body" style={{ overflowY: 'auto', padding: '1.5rem 1.5rem 2rem' }}>
                        <div className="form-grid">
                            <div className="form-group full-col">
                                <label className="form-label" style={{ color: 'var(--primary-light)', marginTop: '0.25rem', marginBottom: '0.5rem' }}>User Credentials</label>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="username">Username</label>
                                <div className="search-wrapper" style={{ display: 'block' }}>
                                    <UserIcon className="search-icon" size={14} style={{ top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        id="username"
                                        className={`form-control ${errors.username ? 'error' : ''}`}
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="johndoe"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                                {errors.username && <span className="form-error">{errors.username}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="email">Email Address</label>
                                <div className="search-wrapper" style={{ display: 'block' }}>
                                    <Mail className="search-icon" size={14} style={{ top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="email"
                                        id="email"
                                        className={`form-control ${errors.email ? 'error' : ''}`}
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                {errors.email && <span className="form-error">{errors.email}</span>}
                            </div>

                            <div className="form-group full-col">
                                <label className="form-label" htmlFor="password">
                                    Password {initialData && <span style={{ fontWeight: 400, color: 'var(--text-muted)', textTransform: 'none', marginLeft: '4px' }}>(Leave blank to keep current)</span>}
                                </label>
                                <div className="search-wrapper" style={{ display: 'block' }}>
                                    <Lock className="search-icon" size={14} style={{ top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="password"
                                        id="password"
                                        className={`form-control ${errors.password ? 'error' : ''}`}
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder={initialData ? '••••••••' : 'Enter strong password'}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                {errors.password && <span className="form-error">{errors.password}</span>}
                            </div>

                            <div className="divider full-col" style={{ margin: '1rem 0' }} />

                            <div className="form-group full-col">
                                <label className="form-label" style={{ color: 'var(--primary-light)', marginBottom: '0.5rem' }}>Access Role</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.25rem' }}>
                                    <div
                                        className="card"
                                        style={{
                                            padding: '1.25rem',
                                            cursor: 'pointer',
                                            border: formData.role === 'USER' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                            background: formData.role === 'USER' ? 'var(--primary-glow)' : 'var(--bg-input)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.75rem',
                                            transition: 'var(--transition)',
                                            position: 'relative'
                                        }}
                                        onClick={() => setFormData({ ...formData, role: 'USER' })}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: formData.role === 'USER' ? 'var(--primary)' : 'var(--bg-card)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <ShieldCheck size={20} color={formData.role === 'USER' ? '#fff' : 'var(--text-muted)'} />
                                            </div>
                                            {formData.role === 'USER' ? <CheckCircle2 size={18} color="var(--primary)" /> : <Circle size={18} color="var(--border-color)" />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Member</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Standard access to employee records and departments</div>
                                        </div>
                                    </div>

                                    <div
                                        className="card"
                                        style={{
                                            padding: '1.25rem',
                                            cursor: 'pointer',
                                            border: formData.role === 'ADMIN' ? '2px solid var(--accent-purple)' : '1px solid var(--border-color)',
                                            background: formData.role === 'ADMIN' ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-input)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.75rem',
                                            transition: 'var(--transition)',
                                            position: 'relative'
                                        }}
                                        onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: formData.role === 'ADMIN' ? 'var(--accent-purple)' : 'var(--bg-card)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <ShieldAlert size={20} color={formData.role === 'ADMIN' ? '#fff' : 'var(--text-muted)'} />
                                            </div>
                                            {formData.role === 'ADMIN' ? <CheckCircle2 size={18} color="var(--accent-purple)" /> : <Circle size={18} color="var(--border-color)" />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Administrator</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Full system control, user management and system settings</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="divider full-col" style={{ margin: '1rem 0' }} />

                            <div className="form-group full-col">
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: 'var(--bg-input)',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div>
                                        <label className="form-label" style={{ marginBottom: '2px' }}>Account Status</label>
                                        <p style={{ fontSize: '0.75rem', color: formData.enabled ? 'var(--accent-green)' : 'var(--text-muted)', fontWeight: 500 }}>
                                            {formData.enabled ? 'Active Account' : 'Deactivated'}
                                        </p>
                                    </div>
                                    <div
                                        onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                                        style={{
                                            width: '48px',
                                            height: '24px',
                                            background: formData.enabled ? 'var(--gradient-success)' : 'var(--text-muted)',
                                            borderRadius: '20px',
                                            padding: '3px',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transition: 'var(--transition)',
                                            opacity: formData.enabled ? 1 : 0.4
                                        }}
                                    >
                                        <div style={{
                                            width: '18px',
                                            height: '18px',
                                            background: '#fff',
                                            borderRadius: '50%',
                                            transform: formData.enabled ? 'translateX(24px)' : 'translateX(0)',
                                            transition: 'var(--transition)',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer" style={{ borderTop: 'none', padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.01)', flexShrink: 0 }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading} style={{ border: 'none' }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '160px', borderRadius: '12px' }}>
                            {loading ? (
                                <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderColor: '#fff', borderTopColor: 'transparent' }} />
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span style={{ marginLeft: '4px' }}>{initialData ? 'Update Profile' : 'Create Account'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
