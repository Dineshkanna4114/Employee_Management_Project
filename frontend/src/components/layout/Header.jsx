import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Bell, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/employees': 'Employees',
    '/departments': 'Departments',
}

export default function Header({ onMenuClick }) {
    const { user, logout } = useAuth()
    const location = useLocation()
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const title = pageTitles[location.pathname] || 'EMS'

    return (
        <header className="header">
            <div className="header-left">
                {/* <button
                    className="btn-icon btn-secondary"
                    onClick={onMenuClick}
                    aria-label="Toggle menu"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Menu size={18} />
                </button> */}
                <h1 className="header-title">{title}</h1>
            </div>

            <div className="header-right">
                {/* Notification Bell */}
                <div className="tooltip-container" style={{ position: 'relative' }}>
                    <button className="btn-icon btn-secondary" aria-label="Notifications">
                        <Bell size={18} />
                    </button>
                    <div className="notif-dot" />
                    <span className="tooltip-text">Notifications</span>
                </div>

                {/* User Dropdown */}
                <div className="dropdown">
                    <button
                        className="btn-secondary btn"
                        style={{ gap: '0.5rem', padding: '0.4rem 0.875rem' }}
                        onClick={() => setDropdownOpen(p => !p)}
                        aria-label="User menu"
                    >
                        <div className="user-avatar" style={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.username}</span>
                        <ChevronDown size={14} style={{ color: 'var(--text-muted)', transition: 'all 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
                    </button>

                    {dropdownOpen && (
                        <>
                            <div
                                style={{ position: 'fixed', inset: 0, zIndex: 400 }}
                                onClick={() => setDropdownOpen(false)}
                            />
                            <div className="dropdown-menu" style={{ zIndex: 500 }}>
                                <div style={{ padding: '0.5rem 0.875rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.25rem' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user?.username}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                                    <span className="badge badge-primary" style={{ marginTop: '0.4rem' }}>{user?.role}</span>
                                </div>
                                <div className="dropdown-item">
                                    <User size={15} /> Profile
                                </div>
                                <div className="dropdown-item danger" onClick={() => { setDropdownOpen(false); logout() }}>
                                    <LogOut size={15} /> Logout
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
