import api from './axios'

// Auth
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
}

// Employees
export const employeeAPI = {
    getAll: (params) => api.get('/employees', { params }),
    getById: (id) => api.get(`/employees/${id}`),
    create: (data) => api.post('/employees', data),
    update: (id, data) => api.put(`/employees/${id}`, data),
    delete: (id) => api.delete(`/employees/${id}`),
    updateStatus: (id, status) => api.patch(`/employees/${id}/status`, null, { params: { status } }),
    uploadImage: (id, formData) => api.post(`/employees/${id}/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getDashboardStats: () => api.get('/employees/dashboard/stats'),
}

// Departments
export const departmentAPI = {
    getAll: () => api.get('/departments'),
    getById: (id) => api.get(`/departments/${id}`),
    create: (data) => api.post('/departments', data),
    update: (id, data) => api.put(`/departments/${id}`, data),
    delete: (id) => api.delete(`/departments/${id}`),
}
