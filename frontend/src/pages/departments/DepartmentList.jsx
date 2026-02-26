import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit2, Trash2, Building2, Users, RefreshCw, Search } from 'lucide-react'
import { departmentAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'
import { Modal, ConfirmDialog } from '../../components/common/Modal'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

function DepartmentForm({ isOpen, onClose, onSubmit, initialData, loading }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    useEffect(() => {
        if (isOpen) {
            reset(initialData ? { name: initialData.name, description: initialData.description || '' } : { name: '', description: '' })
        }
    }, [isOpen, initialData, reset])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Department' : 'Add Department'}
            size="sm"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                    <div className="form-group">
                        <label className="form-label">Department Name *</label>
                        <input
                            id="dept-name"
                            className={`form-control ${errors.name ? 'error' : ''}`}
                            placeholder="e.g. Engineering"
                            {...register('name', {
                                required: 'Name is required',
                                minLength: { value: 2, message: 'At least 2 characters' },
                                maxLength: { value: 100, message: 'Max 100 characters' },
                            })}
                        />
                        {errors.name && <span className="form-error">{errors.name.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            id="dept-description"
                            className="form-control"
                            placeholder="Department description..."
                            rows={3}
                            style={{ resize: 'vertical' }}
                            {...register('description', { maxLength: { value: 500, message: 'Max 500 characters' } })}
                        />
                        {errors.description && <span className="form-error">{errors.description.message}</span>}
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={loading} id="dept-form-submit">
                        {loading
                            ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</>
                            : initialData ? 'Update' : 'Add Department'
                        }
                    </button>
                </div>
            </form>
        </Modal>
    )
}

const DEPT_GRADIENTS = [
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
]

export default function DepartmentList() {
    const { isAdmin } = useAuth()
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(false)
    const [formLoading, setFormLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [formOpen, setFormOpen] = useState(false)
    const [editDept, setEditDept] = useState(null)
    const [deleteDept, setDeleteDept] = useState(null)
    const [search, setSearch] = useState('')

    const fetchDepartments = useCallback(async () => {
        setLoading(true)
        try {
            const res = await departmentAPI.getAll()
            setDepartments(res.data.data || [])
        } catch {
            toast.error('Failed to load departments')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchDepartments() }, [fetchDepartments])

    const handleCreate = async (data) => {
        setFormLoading(true)
        try {
            await departmentAPI.create(data)
            toast.success('Department created!')
            setFormOpen(false)
            fetchDepartments()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create department')
        } finally {
            setFormLoading(false)
        }
    }

    const handleUpdate = async (data) => {
        setFormLoading(true)
        try {
            await departmentAPI.update(editDept.id, data)
            toast.success('Department updated!')
            setEditDept(null)
            fetchDepartments()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update department')
        } finally {
            setFormLoading(false)
        }
    }

    const handleDelete = async () => {
        setDeleteLoading(true)
        try {
            await departmentAPI.delete(deleteDept.id)
            toast.success('Department deleted')
            setDeleteDept(null)
            fetchDepartments()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cannot delete: department has employees')
        } finally {
            setDeleteLoading(false)
        }
    }

    const filtered = departments.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.description || '').toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="page-enter">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="page-header-title">Departments</h1>
                    <p className="page-header-subtitle">
                        Manage organizational departments · {departments.length} total
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={fetchDepartments}>
                        <RefreshCw size={15} />
                    </button>
                    {isAdmin() && (
                        <button
                            className="btn btn-primary"
                            onClick={() => { setEditDept(null); setFormOpen(true) }}
                            id="add-dept-btn"
                        >
                            <Plus size={16} /> Add Department
                        </button>
                    )}
                </div>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div className="search-wrapper" style={{ maxWidth: 360 }}>
                    <Search className="search-icon" />
                    <input
                        id="dept-search"
                        type="text"
                        className="search-input"
                        style={{ width: '100%' }}
                        placeholder="Search departments..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Department Cards Grid */}
            {loading ? (
                <div className="loading-container">
                    <div className="spinner" />
                    <p>Loading departments...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <Building2 size={32} />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem' }}>No Departments Found</h3>
                    <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        {search ? 'Try a different search term' : 'Get started by adding your first department'}
                    </p>
                    {isAdmin() && !search && (
                        <button
                            className="btn btn-primary"
                            onClick={() => { setEditDept(null); setFormOpen(true) }}
                        >
                            <Plus size={16} /> Add First Department
                        </button>
                    )}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.25rem'
                }}>
                    {filtered.map((dept, i) => (
                        <div key={dept.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Card Top Band */}
                            <div style={{
                                height: 6,
                                background: DEPT_GRADIENTS[i % DEPT_GRADIENTS.length],
                            }} />

                            <div style={{ padding: '1.5rem' }}>
                                {/* Icon + Actions */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{
                                        width: 52, height: 52, borderRadius: 14,
                                        background: DEPT_GRADIENTS[i % DEPT_GRADIENTS.length],
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                                    }}>
                                        <Building2 size={24} color="#fff" />
                                    </div>

                                    {isAdmin() && (
                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                            <button
                                                className="btn btn-secondary btn-icon btn-sm"
                                                onClick={() => setEditDept(dept)}
                                                aria-label="Edit department"
                                                id={`edit-dept-${dept.id}`}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                className="btn btn-icon btn-sm"
                                                style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e' }}
                                                onClick={() => setDeleteDept(dept)}
                                                aria-label="Delete department"
                                                id={`delete-dept-${dept.id}`}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Name */}
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>{dept.name}</h3>

                                {/* Description */}
                                <p style={{
                                    fontSize: '0.8rem', color: 'var(--text-muted)',
                                    marginBottom: '1.25rem', lineHeight: 1.5,
                                    minHeight: '2.4em',
                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                }}>
                                    {dept.description || 'No description provided'}
                                </p>

                                {/* Employee Count */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.6rem 0.875rem',
                                    background: 'var(--bg-input)',
                                    borderRadius: 8, fontSize: '0.8rem', fontWeight: 600
                                }}>
                                    <Users size={15} style={{ color: 'var(--primary-light)' }} />
                                    <span style={{ color: 'var(--text-secondary)' }}>Employees: </span>
                                    <span style={{ color: 'var(--text-primary)' }}>{dept.employeeCount ?? 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Department Form Modal */}
            <DepartmentForm
                isOpen={formOpen || !!editDept}
                onClose={() => { setFormOpen(false); setEditDept(null) }}
                onSubmit={editDept ? handleUpdate : handleCreate}
                initialData={editDept}
                loading={formLoading}
            />

            {/* Delete Confirm */}
            <ConfirmDialog
                isOpen={!!deleteDept}
                onClose={() => setDeleteDept(null)}
                onConfirm={handleDelete}
                loading={deleteLoading}
                title="Delete Department"
                message={`Delete "${deleteDept?.name}"? This cannot be undone. Ensure no employees are assigned to this department first.`}
            />
        </div>
    )
}
