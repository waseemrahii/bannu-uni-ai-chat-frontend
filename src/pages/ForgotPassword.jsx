import { useState } from "react"
import { authService } from "../services/auth"
import { Mail, Loader2 } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    try {
      await authService.forgotPassword(email)
      setMessage("If your email exists, we sent a reset link.")
    } catch (err) {
      setMessage(err?.response?.data?.message || "Unable to send reset link")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="mx-auto max-w-md w-full">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Forgot Password</h1>
      {message && (
        <div className="mb-3 rounded-md border border-blue-200 bg-blue-50 text-blue-800 px-3 py-2 text-sm">
          {message}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Send Reset Link
        </button>
      </form>
    </div>
  )
}
