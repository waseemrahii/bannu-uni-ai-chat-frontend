import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Input from "../ui/Input"
import Button from "../ui/Button"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "male",
    className: "",
    semester: "",
    rollNo: "",
    session: "",
  })

  const [loading, setLoading] = useState(false)
  const { register, error } = useAuth()
  const navigate = useNavigate()
  const [notice, setNotice] = useState(null)

  const sessions = Array.from({ length: 8 }, (_, i) => {
    const start = 2018 + i
    const end = start + 4
    return `${start}-${end}`
  })

  const classOptions = ["A", "B", "C", "D"]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setNotice(null)
    if (formData.password !== formData.confirmPassword) {
      setNotice({ type: "error", message: "Passwords do not match." })
      return
    }
    if (!sessions.includes(formData.session)) {
      setNotice({ type: "error", message: "Please select a valid session." })
      return
    }
    if (!classOptions.includes(formData.className)) {
      setNotice({ type: "error", message: "Please select a valid class (A–D)." })
      return
    }
    setLoading(true)
    const { confirmPassword, ...submitData } = formData
    const result = await register(submitData)
    setLoading(false)
    if (result?.success) {
      setNotice({ type: "success", message: "Account created! Redirecting to chat..." })
      setTimeout(() => navigate("/chat"), 900)
    } else if (result?.error) {
      setNotice({ type: "error", message: result.error })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl rounded-xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center">
          <img src="/images/ustb-logo.png" alt="UST Bannu" className="h-12 w-12 mb-2" />
          <h2 className="mt-1 text-center text-2xl font-bold tracking-tight text-gray-900">Create your account</h2>
          <p className="mt-1 text-center text-sm text-gray-600">Join the CS Department at UST Bannu</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              placeholder="student@bannuuni.edu.pk"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              required
              placeholder="03001234567"
              value={formData.phone}
              onChange={handleChange}
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Class</label>
              <select
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Select class
                </option>
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                name="semester"
                required
                value={formData.semester}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Select semester
                </option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={String(n)}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Session</label>
              <select
                name="session"
                value={formData.session}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Select session
                </option>
                {sessions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Roll Number"
              name="rollNo"
              type="text"
              placeholder="2021-CS-123"
              value={formData.rollNo}
              onChange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" loading={loading} className="w-full bg-[#4CB9F1]">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-university-blue hover:text-blue-500">
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
