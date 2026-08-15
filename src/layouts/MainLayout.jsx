import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import Footer from '../components/layout/Footer'

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-slate-50">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1 min-w-0">
        <Sidebar isOpen={isSidebarOpen} onNavigate={closeSidebar} />

        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={closeSidebar}
            className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          />
        )}

        <main className="min-w-0 flex-1 px-3 py-5 sm:px-4 sm:py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default MainLayout