
import { Outlet, Link, useLocation, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../../context/AuthContext"
import { LayoutDashboard, CalendarCheck, CalendarDays, FileText, Megaphone, Users, LogOut, Menu, X, MessageCircle } from "lucide-react"
import { useState } from "react"

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/events", label: "Events", icon: Megaphone },
  { to: "/dashboard/schedules", label: "Schedules", icon: CalendarDays },
  { to: "/dashboard/results", label: "Results", icon: FileText },
  { to: "/dashboard/general-info", label: "General Info", icon: CalendarCheck },
  { to: "/dashboard/users", label: "Users", icon: Users, roles: ["admin"] }, // Only for admin
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Gate by role (admin or CR)
  if (!user || (user.role !== "admin" && user.role !== "cr")) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed and scrollable */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform flex-col border-r bg-white transition-transform duration-300 ease-in-out md:translate-x-0 md:flex ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex h-14 items-center justify-between border-b px-4 bg-gradient-to-r from-blue-600/10 to-blue-600/0">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" size={20} />
            <span className="font-semibold">University Dashboard</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="p-2">
            <ul className="space-y-1">
              {nav
                .filter((n) => !n.roles || n.roles.includes(user.role))
                .map((n) => {
                  const Icon = n.icon
                  const active = n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to)
                  return (
                    <li key={n.to}>
                      <Link
                        to={n.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer ${
                          active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"
                        }`}
                      >
                        <Icon size={18} className={active ? "opacity-100" : "opacity-80 group-hover:opacity-100"} />
                        {n.label}
                        <span
                          className={`ml-auto h-2 w-2 rounded-full ${
                            active ? "bg-white/90" : "bg-blue-600/20 group-hover:bg-blue-600/40"
                          }`}
                        />
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </div>
        </nav>
        
        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t p-2 bg-white">
          {/* Back to Chat Button - Desktop */}
          <div className="hidden md:block mb-2">
            <Link 
              to="/chat" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
            >
              <MessageCircle size={18} className="text-blue-600" />
              Back to Chat
            </Link>
          </div>

          <div className="mb-2 px-3 py-2 text-xs text-gray-500 border-b">
            <div className="font-medium text-gray-700">{user.name}</div>
            <div className="text-gray-500">{user.email}</div>
            <div className="text-gray-400 mt-1">
              {user.className} Class • {user.semester} Semester
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden cursor-pointer"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content - Independent scrolling */}
      <main className="flex-1 min-w-0 md:ml-64">
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white px-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <LayoutDashboard className="text-blue-600" size={20} />
              <span className="font-semibold">Dashboard</span>
            </div>
          </div>
          
          {/* Back to Chat Button - Mobile & Desktop */}
          <Link 
            to="/chat" 
            className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer bg-white shadow-sm"
          >
            <MessageCircle size={16} className="md:hidden" />
            <span>Back to Chat</span>
          </Link>
        </div>

        {/* Scrollable Main Content */}
        <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mx-auto w-full max-w-6xl p-3 sm:p-4 md:p-6"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  )
}