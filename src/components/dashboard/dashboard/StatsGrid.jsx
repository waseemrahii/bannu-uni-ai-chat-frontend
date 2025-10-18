import { useMemo, memo } from "react"
import { motion } from "framer-motion"
import { Users, Calendar, Megaphone, Award, Bell, Activity } from "lucide-react"

const statCards = {
  admin: [
    { key: "totalUsers", label: "Total Users", icon: Users, color: "bg-purple-500" },
    { key: "totalSchedules", label: "Schedules", icon: Calendar, color: "bg-blue-500" },
    { key: "totalEvents", label: "Events", icon: Megaphone, color: "bg-green-500" },
    { key: "totalResults", label: "Results", icon: Award, color: "bg-orange-500" },
    { key: "totalAnnouncements", label: "Announcements", icon: Bell, color: "bg-red-500" },
    { key: "totalChats", label: "Chats", icon: Activity, color: "bg-indigo-500" }
  ],
  cr: [
    { key: "totalStudents", label: "Students", icon: Users, color: "bg-green-500" },
    { key: "totalSchedules", label: "Schedules", icon: Calendar, color: "bg-blue-500" },
    { key: "totalEvents", label: "Events", icon: Megaphone, color: "bg-purple-500" },
    { key: "totalResults", label: "Results", icon: Award, color: "bg-orange-500" }
  ],
  student: [
    { key: "totalSchedules", label: "My Schedules", icon: Calendar, color: "bg-blue-500" },
    { key: "totalEvents", label: "Events", icon: Megaphone, color: "bg-purple-500" },
    { key: "totalResults", label: "My Results", icon: Award, color: "bg-green-500" }
  ]
}

const StatCard = memo(({ card, value, stats, userRole, loading }) => {
  const Icon = card.icon
  
  const getStatValue = (key) => {
    if (loading) return "0"
    
    const keyMap = {
      totalUsers: stats?.users?.total || 0,
      totalStudents: stats?.users?.students || 0,
      totalSchedules: stats?.schedules?.total || 0,
      totalEvents: stats?.events?.total || 0,
      totalResults: stats?.results?.total || 0,
      totalAnnouncements: stats?.announcements?.total || 0,
      totalChats: stats?.chats?.total || 0
    }
    
    return (keyMap[key] || 0).toLocaleString()
  }

  const displayValue = loading ? "..." : getStatValue(card.key)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {displayValue}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${card.color} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {userRole === 'admin' && card.key === 'totalUsers' && !loading && (
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span>Students: {stats?.users?.students || 0}</span>
          <span>CRs: {stats?.users?.crs || 0}</span>
          <span>Admins: {stats?.users?.admins || 0}</span>
        </div>
      )}
      
      {userRole === 'admin' && card.key === 'totalSchedules' && !loading && (
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span>Classes: {stats?.schedules?.classes || 0}</span>
          <span>Exams: {stats?.schedules?.exams || 0}</span>
        </div>
      )}
    </motion.div>
  )
})

const StatsGrid = memo(({ stats, userRole, loading }) => {
  const cards = useMemo(() => statCards[userRole] || [], [userRole])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <StatCard
          key={card.key}
          card={card}
          stats={stats}
          userRole={userRole}
          loading={loading}
        />
      ))}
    </div>
  )
})

export default StatsGrid