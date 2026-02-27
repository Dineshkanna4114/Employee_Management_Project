import { useState, useEffect, useCallback } from 'react'
import {
    Plus, Search, Filter, Edit2, Trash2, RefreshCw,
    ShieldAlert, ShieldCheck, Mail, User as UserIcon,
    XCircle, CheckCircle, MoreVertical
} from 'lucide-react'
import { userAPI } from '../../api/services'
import { ConfirmDialog } from '../../components/common/Modal'
import UserForm from './UserForm'
import toast from 'react-hot-toast'

export default function UserList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [formLoading, setFormLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [search, setSearch] = useState('')
    const [filterRole, setFilterRole] = useState('')

    const [formOpen, setFormOpen] = useState(false)
    const [editUser, setEditUser] = useState(null)
    const [deleteUser, setDeleteUser] = useState(null)
    const [actionMenuId, setActionMenuId] = useState(null)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const res = await userAPI.getAll()
            setUsers(res.data.data || [])
        } catch {
            toast.error('Failed to load users')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    const handleCreate = async (data) => {
        setFormLoading(true)
        try {
            await userAPI.create(data)
            toast.success('User created successfully!')
            setFormOpen(false)
            fetchUsers()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create user')
        } finally {
            setFormLoading(false)
        }
    }

    const handleUpdate = async (data) => {
        setFormLoading(true)
        try {
            await userAPI.update(editUser.id, data)
            toast.success('User updated successfully!')
            setEditUser(null)
            fetchUsers()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update user')
        } finally {
            setFormLoading(false)
        }
    }

    const handleDelete = async () => {
        setDeleteLoading(true)
        try {
            await userAPI.delete(deleteUser.id)
            toast.success('User deleted')
            setDeleteUser(null)
            fetchUsers()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user')
        } finally {
            setDeleteLoading(false)
        }
    }

    const filteredUsers = users.filter(u => {
        const matchesSearch =
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        const matchesRole = !filterRole || u.role === filterRole
        return matchesSearch && matchesRole
    })

    return (
        <div className="page-enter">
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="page-header-title">System Users</h1>
                    <p className="page-header-subtitle">
                        Manage portal access and permissions · {filteredUsers.length} users
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={fetchUsers}>
                        <RefreshCw size={15} />
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => { setEditUser(null); setFormOpen(true) }}
                    >
                        <Plus size={16} /> Add User
                    </button>
                </div>
            </div>

            <div className="table-container">
                <div className="filter-section">
                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by username or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="filter-select"
                        value={filterRole}
                        onChange={e => setFilterRole(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="ADMIN">Administrators</option>
                        <option value="USER">Standard Users</option>
                    </select>
                </div>

                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading-container" style={{ minHeight: 250 }}>
                            <div className="spinner" />
                            <p>Loading users...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon"><UserIcon size={32} /></div>
                            <h3>No Users Found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div className="user-avatar">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{user.username}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Mail size={12} /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge`}
                                                style={{
                                                    background: user.role === 'ADMIN' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                                    color: user.role === 'ADMIN' ? 'var(--accent-purple)' : 'var(--primary-light)',
                                                    border: user.role === 'ADMIN' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                                                    padding: '4px 10px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.7rem',
                                                    letterSpacing: '0.02em'
                                                }}
                                            >
                                                {user.role === 'ADMIN' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                                                {user.role === 'ADMIN' ? 'ADMINISTRATOR' : 'MEMBER'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: user.enabled ? 'var(--accent-green)' : 'var(--text-muted)',
                                                    boxShadow: user.enabled ? '0 0 10px var(--accent-green)' : 'none'
                                                }} />
                                                <span style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: 500,
                                                    color: user.enabled ? 'var(--text-primary)' : 'var(--text-muted)'
                                                }}>
                                                    {user.enabled ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ position: 'relative' }}>
                                                <button
                                                    className="btn btn-secondary btn-icon"
                                                    onClick={() => setActionMenuId(actionMenuId === user.id ? null : user.id)}
                                                >
                                                    <MoreVertical size={15} />
                                                </button>

                                                {actionMenuId === user.id && (
                                                    <>
                                                        <div
                                                            style={{ position: 'fixed', inset: 0, zIndex: 400 }}
                                                            onClick={() => setActionMenuId(null)}
                                                        />
                                                        <div className="dropdown-menu" style={{ zIndex: 500, right: 0 }}>
                                                            <div
                                                                className="dropdown-item"
                                                                onClick={() => { setEditUser(user); setActionMenuId(null) }}
                                                            >
                                                                <Edit2 size={14} /> Edit
                                                            </div>
                                                            <div
                                                                className="dropdown-item danger"
                                                                onClick={() => { setDeleteUser(user); setActionMenuId(null) }}
                                                            >
                                                                <Trash2 size={14} /> Delete
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <UserForm
                isOpen={formOpen || !!editUser}
                onClose={() => { setFormOpen(false); setEditUser(null) }}
                onSubmit={editUser ? handleUpdate : handleCreate}
                initialData={editUser}
                loading={formLoading}
            />

            <ConfirmDialog
                isOpen={!!deleteUser}
                onClose={() => setDeleteUser(null)}
                onConfirm={handleDelete}
                loading={deleteLoading}
                title="Delete User"
                message={`Are you sure you want to delete user "${deleteUser?.username}"? This will permanently remove their access.`}
            />
        </div>
    )
}
