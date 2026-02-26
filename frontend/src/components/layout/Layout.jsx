import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="app-layout">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            <div className="main-content">
                <Header onMenuClick={() => setMobileOpen(p => !p)} />
                <main className="page-content page-enter">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
