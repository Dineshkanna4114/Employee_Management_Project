import { useState, useEffect } from 'react'
import { Users, UserCheck, UserX, Building2, TrendingUp, DollarSign, UserPlus } from 'lucide-react'
import {
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts'
import { employeeAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#0ea5e9', '#8b5cf6', '#f97316', '#14b8a6']

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.8rem'
        }}>
            {label && <p style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{label}</p>}
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }}>{p.name}: <b>{p.value?.toLocaleString()}</b></p>
            ))}
        </div>
    )
}

export default function Dashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        employeeAPI.getDashboardStats()
            .then(res => setStats(res.data.data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const deptChartData = stats
        ? Object.entries(stats.departmentStats || {}).map(([name, count]) => ({ name, count }))
        : []

    const pieData = stats ? [
        { name: 'Active', value: Number(stats.activeEmployees) },
        { name: 'Inactive', value: Number(stats.inactiveEmployees) },
    ] : []

    const statCards = stats ? [
        {
            label: 'Total Employees',
            value: stats.totalEmployees,
            icon: Users,
            variant: 'primary',
            iconColor: '#818cf8',
            trend: '↑ All time',
        },
        {
            label: 'Active Employees',
            value: stats.activeEmployees,
            icon: UserCheck,
            variant: 'success',
            iconColor: '#10b981',
            trend: `${stats.totalEmployees > 0 ? Math.round(stats.activeEmployees / stats.totalEmployees * 100) : 0}% of total`,
        },
        {
            label: 'Inactive Employees',
            value: stats.inactiveEmployees,
            icon: UserX,
            variant: 'danger',
            iconColor: '#f43f5e',
            trend: `${stats.totalEmployees > 0 ? Math.round(stats.inactiveEmployees / stats.totalEmployees * 100) : 0}% of total`,
        },
        {
            label: 'Departments',
            value: stats.totalDepartments,
            icon: Building2,
            variant: 'warning',
            iconColor: '#f59e0b',
            trend: 'Active departments',
        },
        {
            label: 'Avg. Salary',
            value: `₹${Number(stats.averageSalary).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
            icon: DollarSign,
            variant: 'primary',
            iconColor: '#0ea5e9',
            trend: 'Per employee',
        },
        {
            label: 'Joined This Month',
            value: stats.newJoineesThisMonth,
            icon: UserPlus,
            variant: 'success',
            iconColor: '#8b5cf6',
            trend: 'New joinees',
        },
    ] : []

    if (loading) return (
        <div className="loading-container">
            <div className="spinner" style={{ width: 50, height: 50 }} />
            <p>Loading dashboard...</p>
        </div>
    )

    return (
        <div className="page-enter">
            {/* Welcome Banner */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.10) 100%)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 20,
                padding: '1.75rem 2rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                        Good {getTimeOfDay()}, <span className="gradient-text">{user?.username}</span>! 👋
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Here's what's happening in your organization today.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-light)' }}>
                            {stats?.totalEmployees || 0}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Staff</div>
                    </div>
                    <div style={{ width: 1, height: 50, background: 'var(--border-color)' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                            {stats?.totalDepartments || 0}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Departments</div>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
                {statCards.map((card, i) => (
                    <div key={i} className={`stat-card ${card.variant}`}>
                        <div className="stat-card-icon">
                            <card.icon size={24} color={card.iconColor} />
                        </div>
                        <div className="stat-card-content">
                            <div className="stat-card-label">{card.label}</div>
                            <div className="stat-card-value">{card.value}</div>
                            <div className="stat-card-trend" style={{ color: 'var(--text-muted)' }}>{card.trend}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="dashboard-grid">
                {/* Department Bar Chart */}
                <div className="chart-container">
                    <div className="chart-title">
                        <Building2 size={18} color="var(--primary-light)" />
                        Employees by Department
                    </div>
                    {deptChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={deptChartData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    angle={-35}
                                    textAnchor="end"
                                    interval={0}
                                />
                                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Employees" radius={[6, 6, 0, 0]}>
                                    {deptChartData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state" style={{ minHeight: 200 }}>
                            <p>No department data yet</p>
                        </div>
                    )}
                </div>

                {/* Pie Chart */}
                <div className="chart-container">
                    <div className="chart-title">
                        <TrendingUp size={18} color="var(--primary-light)" />
                        Employee Status Distribution
                    </div>
                    {(stats?.totalEmployees || 0) > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={95}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {pieData.map((_, i) => (
                                            <Cell key={i} fill={i === 0 ? '#10b981' : '#f43f5e'} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#10b981' }}>{stats?.activeEmployees}</div>
                                    <div style={{ color: 'var(--text-muted)' }}>Active</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#f43f5e' }}>{stats?.inactiveEmployees}</div>
                                    <div style={{ color: 'var(--text-muted)' }}>Inactive</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state" style={{ minHeight: 200 }}>
                            <p>No employees data yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function getTimeOfDay() {
    const h = new Date().getHours()
    if (h < 12) return 'Morning'
    if (h < 17) return 'Afternoon'
    return 'Evening'
}
