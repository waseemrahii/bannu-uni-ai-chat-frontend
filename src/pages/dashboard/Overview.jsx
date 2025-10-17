
import { motion } from "framer-motion"
import { Megaphone, CalendarDays, FileText, Users } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

function Stat({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        <div className={`rounded-md p-2 ${color}`}>
          <Icon className="text-white" size={20} />
        </div>
      </div>
    </div>
  )
}

export default function Overview() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-balance text-2xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-gray-600">
          Manage class schedules, exams, results, events, and general information from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Megaphone} label="Upcoming Events" value="—" color="bg-blue-600" />
        <Stat icon={CalendarDays} label="Schedules" value="—" color="bg-emerald-600" />
        <Stat icon={FileText} label="Results Published" value="—" color="bg-amber-600" />
        <Stat icon={Users} label="Total Users" value="—" color="bg-slate-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-lg border bg-white p-4"
      >
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a href="/dashboard/events" className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
            Create Event
          </a>
          <a href="/dashboard/schedules" className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
            Add Schedule
          </a>
          <a href="/dashboard/results" className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
            Publish Result
          </a>
          <a href="/dashboard/general-info" className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
            Post General Info
          </a>
          <a href="/dashboard/users" className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
            Add CR (Admin)
          </a>
        </div>
      </motion.div>
    </div>
  )
}
