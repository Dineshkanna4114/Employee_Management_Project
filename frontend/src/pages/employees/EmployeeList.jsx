import { useState, useEffect, useCallback } from 'react'
import {
    Plus, Search, Filter, Edit2, Trash2, RefreshCw,
    Download, ChevronLeft, ChevronRight, CheckCircle, XCircle,
    MoreVertical, Eye, UserCheck, UserX
} from 'lucide-react'
import { employeeAPI, departmentAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'
import { ConfirmDialog } from '../../components/common/Modal'
import EmployeeForm from './EmployeeForm'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

export default function EmployeeList() {
    const { isAdmin } = useAuth()

    const [employees, setEmployees] = useState([])
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(false)
    const [formLoading, setFormLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [pagination, setPagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 })
    const [search, setSearch] = useState('')
    const [filterDept, setFilterDept] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [sortBy, setSortBy] = useState('id')
    const [sortDir, setSortDir] = useState('asc')

    const [formOpen, setFormOpen] = useState(false)
    const [editEmployee, setEditEmployee] = useState(null)
    const [deleteEmployee, setDeleteEmployee] = useState(null)
    const [actionMenuId, setActionMenuId] = useState(null)

    const fetchDepartments = useCallback(async () => {
        try {
            const res = await departmentAPI.getAll()
            setDepartments(res.data.data || [])
        } catch { }
    }, [])

    const fetchEmployees = useCallback(async (page = 0) => {
        setLoading(true)
        try {
            const res = await employeeAPI.getAll({
                page, size: pagination.size, sortBy, sortDir,
                search: search || undefined,
                departmentId: filterDept || undefined,
                status: filterStatus || undefined,
            })
            const data = res.data.data
            setEmployees(data.content || [])
            setPagination(p => ({
                ...p, page: data.number, totalElements: data.totalElements, totalPages: data.totalPages
            }))
        } catch {
            toast.error('Failed to load employees')
        } finally {
            setLoading(false)
        }
    }, [pagination.size, sortBy, sortDir, search, filterDept, filterStatus])

    useEffect(() => { fetchDepartments() }, [fetchDepartments])
    useEffect(() => { fetchEmployees(0) }, [search, filterDept, filterStatus, sortBy, sortDir])

    const handleCreate = async (data) => {
        setFormLoading(true)
        try {
            await employeeAPI.create(data)
            toast.success('Employee added successfully!')
            setFormOpen(false)
            fetchEmployees(0)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create employee')
        } finally {
            setFormLoading(false)
        }
    }

    const handleUpdate = async (data) => {
        setFormLoading(true)
        try {
            await employeeAPI.update(editEmployee.id, data)
            toast.success('Employee updated successfully!')
            setEditEmployee(null)
            fetchEmployees(pagination.page)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update employee')
        } finally {
            setFormLoading(false)
        }
    }

    const handleDelete = async () => {
        setDeleteLoading(true)
        try {
            await employeeAPI.delete(deleteEmployee.id)
            toast.success('Employee deleted')
            setDeleteEmployee(null)
            fetchEmployees(0)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete employee')
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleStatusToggle = async (emp) => {
        const newStatus = emp.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        try {
            await employeeAPI.updateStatus(emp.id, newStatus)
            toast.success(`Status changed to ${newStatus}`)
            fetchEmployees(pagination.page)
        } catch {
            toast.error('Failed to update status')
        }
        setActionMenuId(null)
    }

    const exportToExcel = () => {
        const data = employees.map(e => ({
            'Employee ID': e.employeeId,
            'First Name': e.firstName,
            'Last Name': e.lastName,
            'Email': e.email,
            'Phone': e.phone || '-',
            'Department': e.departmentName || '-',
            'Salary': e.salary || '-',
            'Joining Date': e.joiningDate || '-',
            'Status': e.status,
        }))
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Employees')
        XLSX.writeFile(wb, `employees_${new Date().toISOString().slice(0, 10)}.xlsx`)
        toast.success('Exported to Excel!')
    }

    const getInitials = (emp) =>
        `${emp.firstName?.charAt(0) || ''}${emp.lastName?.charAt(0) || ''}`.toUpperCase()

    const avatarColors = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#0ea5e9', '#8b5cf6', '#f97316', '#14b8a6']

    return (
        <div className="page-enter">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="page-header-title">Employees</h1>
                    <p className="page-header-subtitle">
                        Manage your workforce · {pagination.totalElements} total records
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary btn-sm" onClick={exportToExcel} id="export-excel-btn">
                        <Download size={15} /> Export Excel
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => fetchEmployees(pagination.page)}>
                        <RefreshCw size={15} />
                    </button>
                    {isAdmin() && (
                        <button
                            className="btn btn-primary"
                            onClick={() => { setEditEmployee(null); setFormOpen(true) }}
                            id="add-employee-btn"
                        >
                            <Plus size={16} /> Add Employee
                        </button>
                    )}
                </div>
            </div>

            {/* Table Container */}
            <div className="table-container">
                {/* Search & Filter Bar */}
                <div className="filter-section">
                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <input
                            id="employee-search"
                            type="text"
                            className="search-input"
                            placeholder="Search by name, email, ID..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <Filter size={15} style={{ color: 'var(--text-muted)' }} />

                    <select
                        id="filter-dept"
                        className="filter-select"
                        value={filterDept}
                        onChange={e => setFilterDept(e.target.value)}
                    >
                        <option value="">All Departments</option>
                        {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>

                    <select
                        id="filter-status"
                        className="filter-select"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>

                    <select
                        id="sort-by"
                        className="filter-select"
                        value={`${sortBy}-${sortDir}`}
                        onChange={e => {
                            const [sb, sd] = e.target.value.split('-')
                            setSortBy(sb); setSortDir(sd)
                        }}
                    >
                        <option value="id-asc">ID (Asc)</option>
                        <option value="id-desc">ID (Desc)</option>
                        <option value="firstName-asc">Name (A-Z)</option>
                        <option value="firstName-desc">Name (Z-A)</option>
                        <option value="salary-desc">Salary (High)</option>
                        <option value="salary-asc">Salary (Low)</option>
                        <option value="joiningDate-desc">Newest First</option>
                        <option value="joiningDate-asc">Oldest First</option>
                    </select>
                </div>

                {/* Table */}
                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading-container" style={{ minHeight: 250 }}>
                            <div className="spinner" />
                            <p>Loading employees...</p>
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <Search size={32} />
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>No Employees Found</h3>
                            <p style={{ fontSize: '0.875rem' }}>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Emp ID</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Department</th>
                                    <th>Salary</th>
                                    <th>Joining Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp, idx) => (
                                    <tr key={emp.id}>
                                        <td>
                                            <div className="emp-name-cell">
                                                <div
                                                    className="emp-avatar"
                                                    style={{ background: avatarColors[idx % avatarColors.length] }}
                                                >
                                                    {emp.profileImage
                                                        ? <img src={emp.profileImage} alt={emp.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                                        : getInitials(emp)
                                                    }
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                        {emp.firstName} {emp.lastName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-primary">{emp.employeeId}</span>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{emp.email}</td>
                                        <td>{emp.phone || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                        <td>
                                            {emp.departmentName
                                                ? <span className="badge badge-info">{emp.departmentName}</span>
                                                : <span style={{ color: 'var(--text-muted)' }}>—</span>
                                            }
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            {emp.salary
                                                ? `₹${Number(emp.salary).toLocaleString('en-IN')}`
                                                : <span style={{ color: 'var(--text-muted)' }}>—</span>
                                            }
                                        </td>
                                        <td style={{ fontSize: '0.8rem' }}>
                                            {emp.joiningDate || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                                        </td>
                                        <td>
                                            <span className={`badge ${emp.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                                                {emp.status === 'ACTIVE' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ position: 'relative' }}>
                                                <button
                                                    className="btn btn-secondary btn-icon"
                                                    onClick={() => setActionMenuId(actionMenuId === emp.id ? null : emp.id)}
                                                    aria-label="Actions"
                                                >
                                                    <MoreVertical size={15} />
                                                </button>
                                                {actionMenuId === emp.id && (
                                                    <>
                                                        <div
                                                            style={{ position: 'fixed', inset: 0, zIndex: 400 }}
                                                            onClick={() => setActionMenuId(null)}
                                                        />
                                                        <div className="dropdown-menu" style={{ zIndex: 500, right: 0 }}>
                                                            {isAdmin() && (
                                                                <>
                                                                    <div
                                                                        className="dropdown-item"
                                                                        onClick={() => { setEditEmployee(emp); setActionMenuId(null) }}
                                                                    >
                                                                        <Edit2 size={14} /> Edit
                                                                    </div>
                                                                    <div
                                                                        className="dropdown-item"
                                                                        onClick={() => handleStatusToggle(emp)}
                                                                    >
                                                                        {emp.status === 'ACTIVE'
                                                                            ? <><UserX size={14} /> Deactivate</>
                                                                            : <><UserCheck size={14} /> Activate</>
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className="dropdown-item danger"
                                                                        onClick={() => { setDeleteEmployee(emp); setActionMenuId(null) }}
                                                                    >
                                                                        <Trash2 size={14} /> Delete
                                                                    </div>
                                                                </>
                                                            )}
                                                            {!isAdmin() && (
                                                                <div className="dropdown-item">
                                                                    <Eye size={14} /> View Details
                                                                </div>
                                                            )}
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

                {/* Pagination */}
                {pagination.totalPages > 0 && (
                    <div className="pagination">
                        <div className="pagination-info">
                            Showing {pagination.page * pagination.size + 1}–{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements}
                        </div>
                        <div className="pagination-buttons">
                            <button
                                className="page-btn"
                                onClick={() => fetchEmployees(pagination.page - 1)}
                                disabled={pagination.page === 0}
                                aria-label="Previous page"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                                const pageNum = Math.max(0, Math.min(
                                    pagination.page - 2 + i,
                                    pagination.totalPages - 1
                                ))
                                return (
                                    <button
                                        key={pageNum}
                                        className={`page-btn ${pagination.page === pageNum ? 'active' : ''}`}
                                        onClick={() => fetchEmployees(pageNum)}
                                    >
                                        {pageNum + 1}
                                    </button>
                                )
                            })}
                            <button
                                className="page-btn"
                                onClick={() => fetchEmployees(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages - 1}
                                aria-label="Next page"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Form Modal */}
            <EmployeeForm
                isOpen={formOpen || !!editEmployee}
                onClose={() => { setFormOpen(false); setEditEmployee(null) }}
                onSubmit={editEmployee ? handleUpdate : handleCreate}
                departments={departments}
                initialData={editEmployee}
                loading={formLoading}
            />

            {/* Delete Confirm */}
            <ConfirmDialog
                isOpen={!!deleteEmployee}
                onClose={() => setDeleteEmployee(null)}
                onConfirm={handleDelete}
                loading={deleteLoading}
                title="Delete Employee"
                message={`Are you sure you want to delete ${deleteEmployee?.firstName} ${deleteEmployee?.lastName}? This action cannot be undone.`}
            />
        </div>
    )
}
