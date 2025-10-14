
import { useState } from "react"
import { authService } from "../services/auth"
import { Loader2, ShieldCheck } from "lucide-react"

export default function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirm: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  async function onSubmit(e) {
    e.preventDefault()
    if (form.newPassword !== form.confirm) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }
    setLoading(true)
    setMessage({ type: "", text: "" })
    try {
      await authService.changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword })
      setMessage({ type: "success", text: "Password updated" })
      setForm({ oldPassword: "", newPassword: "", confirm: "" })
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Update failed" })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="mx-auto max-w-md w-full">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h1>
      {message.text && (
        <div
          className={`mb-3 rounded-md border px-3 py-2 text-sm ${message.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
        >
          {message.type === "success" ? <ShieldCheck className="inline mr-1 h-4 w-4" /> : null}
          {message.text}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Old Password</label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            type="password"
            value={form.oldPassword}
            onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
          />
        </div>
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
          Save Password
        </button>
      </form>
    </div>
  )
}
