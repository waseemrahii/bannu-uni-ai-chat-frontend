
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Input from "../ui/Input"
import Button from "../ui/Button"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const { login, error } = useAuth()
  const navigate = useNavigate()
  const [notice, setNotice] = useState(null) // { type: 'success'|'error', message: string }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setNotice(null)
    const result = await login(formData.email, formData.password)
    setLoading(false)
    if (result?.success) {
      setNotice({ type: "success", message: "Welcome back! Redirecting to chat..." })
      setTimeout(() => navigate("/chat"), 700)
    } else if (result?.error) {
      setNotice({ type: "error", message: result.error })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center">
          <img src="/images/ustb-logo.png" alt="UST Bannu" className="h-12 w-12 mb-2" />
          <h2 className="mt-1 text-center text-2xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
          <p className="mt-1 text-center text-sm text-gray-600">University of Science & Technology Bannu</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(notice || error) && (
            <div
              role="status"
              aria-live="polite"
              className={`flex items-start gap-3 rounded-md p-3 border ${
                (notice?.type || (error && "error")) === "error"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              {(notice?.type || (error && "error")) === "error" ? (
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
              )}
              <p className="text-sm">{notice?.message || error}</p>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="student@bannuuni.edu.pk"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-university-blue hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full bg-[#4CB9F1]">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                {/* <Loader2 className="h-4 w-4 animate-spin" /> */}
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-university-blue hover:text-blue-500">
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
