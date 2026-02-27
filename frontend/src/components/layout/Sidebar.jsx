import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, Menu, X, Briefcase, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/departments', label: 'Departments', icon: Building2 },
    { path: '/users', label: 'Users', icon: ShieldCheck, adminOnly: true },
]

export default function Sidebar({ mobileOpen, onClose }) {
    const { user, isAdmin } = useAuth()
    const location = useLocation()

    const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin())

    return (
        <>
            {mobileOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1099, backdropFilter: 'blur(4px)' }}
                    onClick={onClose}
                />
            )}
            <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
                {/* Logo */}
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <Briefcase size={22} color="#fff" />
                    </div>
                    <div className="sidebar-logo-text">
                        <h2>EMS</h2>
                        <p>Management Portal</p>
                    </div>
                    <button
                        className="btn-icon btn-secondary"
                        style={{ marginLeft: 'auto', display: 'none' }}
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <div className="sidebar-section-title">Main Menu</div>
                    {filteredNavItems.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <Icon size={18} className="nav-icon" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Sidebar Footer - User Info */}
                <div className="sidebar-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="user-avatar" style={{ cursor: 'default' }}>
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.username}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user?.role}</div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
