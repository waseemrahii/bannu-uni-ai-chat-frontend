"use client"

import { useEffect, useState } from "react"
import { authService } from "../services/auth"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function Profile() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    className: user?.className || "A",
    department: user?.department || "CS",
    session: user?.session || "2021-2025",
    semester: user?.semester || "1",
    rollNo: user?.rollNo || "",
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: "", message: "" })

  useEffect(() => {
    setForm((f) => ({ ...f, name: user?.name || "", email: user?.email || "" }))
  }, [user])

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: "", message: "" })
    try {
      const { data } = await authService.updateProfile(form)
      setUser(data)
      setStatus({ type: "success", message: "Profile updated successfully" })
    } catch (err) {
      setStatus({ type: "error", message: err?.response?.data?.message || "Update failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl w-full">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Profile</h1>
      {status.message && (
        <div
          className={`mb-3 rounded-md border px-3 py-2 text-sm ${status.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
        >
          {status.type === "success" ? <CheckCircle2 className="inline mr-1 h-4 w-4" /> : null}
          {status.message}
        </div>
      )}
      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Name</label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Class</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={form.className}
            onChange={(e) => setForm({ ...form, className: e.target.value })}
          >
            {["A", "B", "C", "D"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Session</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={form.session}
            onChange={(e) => setForm({ ...form, session: e.target.value })}
          >
            {[
              "2018-2022",
              "2019-2023",
              "2020-2024",
              "2021-2025",
              "2022-2026",
              "2023-2027",
              "2024-2028",
              "2025-2029",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Semester</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={String(form.semester)}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
          >
            {Array.from({ length: 8 })
              .map((_, i) => String(i + 1))
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Roll No</label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={form.rollNo}
            onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <button
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
