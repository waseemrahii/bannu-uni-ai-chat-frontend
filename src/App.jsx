import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ChatProvider } from "./context/ChatContext"
import ErrorBoundary from "./components/ErrorBoundary"
import Home from "./pages/Home"
import Chat from "./pages/Chat"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import LoadingSpinner from "./components/ui/LoadingSpinner"
import Layout from "./components/layout/Layout"
import Profile from "./pages/Profile"
import DashboardLayout from "./components/dashboard/DashboardLayout"
import Overview from "./pages/dashboard/Overview"
import Events from "./pages/dashboard/Events"
import Schedules from "./pages/dashboard/Schedules"
import Results from "./pages/dashboard/Results"
import GeneralInfo from "./pages/dashboard/GeneralInfo"
import Users from "./pages/dashboard/Users"
import { ToastProvider } from "./context/ToastContext"
import Dashboard from "./pages/dashboard/Dashboard"
import StudentDashboard from "./pages/StudentDashboard"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    )
  }

  return !isAuthenticated ? children : <Navigate to="/chat" />
}

function App() {
  return (
        <ToastProvider >


    <ErrorBoundary>
      <AuthProvider>
        <Router basename="/rag">
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatProvider>
                      <Chat />
                    </ChatProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ChatProvider>
                      <Profile />
                    </ChatProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/studentdashboard"
                element={
                  <ProtectedRoute>
                    <ChatProvider>
                      <StudentDashboard />
                    </ChatProvider>
                  </ProtectedRoute>
                }
              />
              {/* Dashboard routes (protected, admin/CR) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="events" element={<Events />} />
                <Route path="schedules" element={<Schedules />} />
                <Route path="results" element={<Results />} />
                <Route path="general-info" element={<GeneralInfo />} />
                <Route path="users" element={<Users />} />
                // In your dashboard routing

              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
            </ToastProvider>

  )
}

export default App
