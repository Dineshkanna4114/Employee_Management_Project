import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '../../components/common/Modal'

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE']

export default function EmployeeForm({ isOpen, onClose, onSubmit, departments, initialData, loading }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    ...initialData,
                    departmentId: initialData.departmentId?.toString() || '',
                    joiningDate: initialData.joiningDate || '',
                    status: initialData.status || 'ACTIVE',
                })
            } else {
                reset({
                    employeeId: '', firstName: '', lastName: '', email: '',
                    phone: '', departmentId: '', salary: '', joiningDate: '',
                    status: 'ACTIVE', address: '',
                })
            }
        }
    }, [isOpen, initialData, reset])

    const handleFormSubmit = (data) => {
        onSubmit({
            ...data,
            departmentId: data.departmentId ? Number(data.departmentId) : null,
            salary: data.salary ? parseFloat(data.salary) : null,
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Employee' : 'Add New Employee'}
            size="lg"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="modal-body">
                    <div className="form-grid">
                        {/* Employee ID */}
                        <div className="form-group">
                            <label className="form-label">Employee ID *</label>
                            <input
                                id="emp-id"
                                className={`form-control ${errors.employeeId ? 'error' : ''}`}
                                placeholder="e.g. EMP001"
                                {...register('employeeId', { required: 'Employee ID is required' })}
                                readOnly={!!initialData}
                            />
                            {errors.employeeId && <span className="form-error">{errors.employeeId.message}</span>}
                        </div>

                        {/* Department */}
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <select id="emp-dept" className="form-control" {...register('departmentId')}>
                                <option value="">Select Department</option>
                                {departments?.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* First Name */}
                        <div className="form-group">
                            <label className="form-label">First Name *</label>
                            <input
                                id="emp-first-name"
                                className={`form-control ${errors.firstName ? 'error' : ''}`}
                                placeholder="John"
                                {...register('firstName', {
                                    required: 'First name is required',
                                    minLength: { value: 2, message: 'Min 2 characters' }
                                })}
                            />
                            {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                        </div>

                        {/* Last Name */}
                        <div className="form-group">
                            <label className="form-label">Last Name *</label>
                            <input
                                id="emp-last-name"
                                className={`form-control ${errors.lastName ? 'error' : ''}`}
                                placeholder="Doe"
                                {...register('lastName', {
                                    required: 'Last name is required',
                                    minLength: { value: 2, message: 'Min 2 characters' }
                                })}
                            />
                            {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input
                                id="emp-email"
                                type="email"
                                className={`form-control ${errors.email ? 'error' : ''}`}
                                placeholder="john.doe@company.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                                })}
                            />
                            {errors.email && <span className="form-error">{errors.email.message}</span>}
                        </div>

                        {/* Phone */}
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input
                                id="emp-phone"
                                className={`form-control ${errors.phone ? 'error' : ''}`}
                                placeholder="+91 9876543210"
                                {...register('phone', {
                                    pattern: { value: /^[+]?[0-9]{10,15}$/, message: 'Invalid phone number' }
                                })}
                            />
                            {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                        </div>

                        {/* Salary */}
                        <div className="form-group">
                            <label className="form-label">Salary (₹)</label>
                            <input
                                id="emp-salary"
                                type="number"
                                step="0.01"
                                min="0"
                                className="form-control"
                                placeholder="50000"
                                {...register('salary')}
                            />
                        </div>

                        {/* Joining Date */}
                        <div className="form-group">
                            <label className="form-label">Joining Date</label>
                            <input
                                id="emp-joining-date"
                                type="date"
                                className="form-control"
                                {...register('joiningDate')}
                                style={{ colorScheme: 'dark' }}
                            />
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select id="emp-status" className="form-control" {...register('status')}>
                                {STATUS_OPTIONS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Address */}
                        <div className="form-group full-col">
                            <label className="form-label">Address</label>
                            <textarea
                                id="emp-address"
                                className="form-control"
                                placeholder="Enter employee address"
                                rows={2}
                                style={{ resize: 'vertical', minHeight: '70px' }}
                                {...register('address')}
                            />
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading} id="emp-form-submit">
                        {loading ? (
                            <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</>
                        ) : (
                            initialData ? 'Update Employee' : 'Add Employee'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
