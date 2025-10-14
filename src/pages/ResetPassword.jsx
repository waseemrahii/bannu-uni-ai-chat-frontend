import { useParams, Link } from "react-router-dom"
import { useState } from "react"
import { authService } from "../services/auth"
import { Loader2, CheckCircle2 } from "lucide-react"

export default function ResetPassword() {
  const { token } = useParams()
  const [form, setForm] = useState({ newPassword: "", confirm: "" })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  async function onSubmit(e) {
    e.preventDefault()
    if (form.newPassword !== form.confirm) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    setError("")
    try {
      await authService.resetPassword(token, form.newPassword)
      setDone(true)
    } catch (err) {
      setError(err?.response?.data?.message || "Reset failed")
    } finally {
      setLoading(false)
    }
  }
  if (done) {
    return (
      <div className="mx-auto max-w-md w-full text-center">
        <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-600" />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Password reset successful</h1>
        <Link to="/login" className="text-blue-600 hover:underline">
          Return to login
        </Link>
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-md w-full">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Reset Password</h1>
      {error && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 text-red-800 px-3 py-2 text-sm">{error}</div>
      )}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">New Password</label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
        </div>
        <button
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Reset Password
        </button>
      </form>
    </div>
  )
}
