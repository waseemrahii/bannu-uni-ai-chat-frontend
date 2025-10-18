import { useMemo, memo } from "react"
import { motion } from "framer-motion"
import { Clock, Calendar } from "lucide-react"

const UpcomingSection = memo(({ upcoming, loading }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysUntil = (dateString) => {
    const today = new Date()
    const eventDate = new Date(dateString)
    const diffTime = eventDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const displaySchedules = useMemo(() => 
    loading ? Array(3).fill({ _id: `loading-${Math.random()}`, kind: 'class', title: 'Loading...', date: new Date() }) 
    : upcoming.schedules?.slice(0, 5) || []
  , [upcoming.schedules, loading])

  const displayEvents = useMemo(() => 
    loading ? Array(2).fill({ _id: `loading-${Math.random()}`, title: 'Loading...', date: new Date() }) 
    : upcoming.events?.slice(0, 3) || []
  , [upcoming.events, loading])

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Upcoming
        </h2>
        <span className="text-sm text-gray-500">
          Next 30 days
        </span>
      </div>

      <div className="space-y-4">
        {displaySchedules.map((schedule, index) => (
          <div key={schedule._id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className={`w-3 h-3 rounded-full ${
              loading ? 'bg-gray-300' :
              schedule.kind === 'class' ? 'bg-blue-500' :
              schedule.kind === 'exam' ? 'bg-red-500' :
              schedule.kind === 'assignment' ? 'bg-green-500' : 'bg-purple-500'
            }`} />
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-gray-900 text-sm truncate ${loading ? 'text-gray-300 bg-gray-300 rounded' : ''}`}>
                {loading ? 'Loading schedule...' : schedule.title}
              </p>
              <p className={`text-xs text-gray-500 ${loading ? 'text-gray-300 bg-gray-300 rounded w-32' : ''}`}>
                {loading ? 'Loading...' : `${schedule.kind} • ${formatDate(schedule.date)}`}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-xs font-medium text-gray-900 ${loading ? 'text-gray-300 bg-gray-300 rounded w-8' : ''}`}>
                {loading ? '...' : `${getDaysUntil(schedule.date)} days`}
              </p>
              {!loading && schedule.startTime && (
                <p className="text-xs text-gray-500">
                  {schedule.startTime}
                </p>
              )}
            </div>
          </div>
        ))}

        {displayEvents.map((event, index) => (
          <div key={event._id} className="flex items-center gap-4 p-3 rounded-lg border border-yellow-100 bg-yellow-50">
            <div className={`w-3 h-3 rounded-full ${loading ? 'bg-gray-300' : 'bg-yellow-500'}`} />
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-gray-900 text-sm truncate ${loading ? 'text-gray-300 bg-gray-300 rounded' : ''}`}>
                {loading ? 'Loading event...' : event.title}
              </p>
              <p className={`text-xs text-gray-500 ${loading ? 'text-gray-300 bg-gray-300 rounded w-24' : ''}`}>
                {loading ? 'Loading...' : `Event • ${formatDate(event.date)}`}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-xs font-medium text-gray-900 ${loading ? 'text-gray-300 bg-gray-300 rounded w-8' : ''}`}>
                {loading ? '...' : `${getDaysUntil(event.date)} days`}
              </p>
            </div>
          </div>
        ))}

        {!loading && displaySchedules.length === 0 && displayEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No upcoming items</p>
          </div>
        )}
      </div>
    </motion.div>
  )
})

export default UpcomingSection