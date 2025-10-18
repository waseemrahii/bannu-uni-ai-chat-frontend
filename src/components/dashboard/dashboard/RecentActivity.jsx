import { memo } from "react"
import { motion } from "framer-motion"
import { Activity, Eye } from "lucide-react"

const RecentActivity = memo(({ activity, loading }) => {
  const displayActivity = loading ? 
    Array(5).fill({ 
      type: 'loading', 
      description: 'Loading activity...', 
      createdBy: { name: 'Loading...' }, 
      timestamp: new Date() 
    }) 
    : activity.slice(0, 8)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-500" />
          Recent Activity
        </h2>
      </div>

      <div className="space-y-3">
        {displayActivity.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
            <div className={`w-2 h-2 rounded-full ${
              loading ? 'bg-gray-300' :
              item.type.includes('schedule') ? 'bg-blue-500' :
              item.type.includes('event') ? 'bg-green-500' :
              item.type.includes('result') ? 'bg-orange-500' : 'bg-purple-500'
            }`} />
            <div className="flex-1">
              <p className={`text-sm text-gray-900 ${loading ? 'text-gray-300 bg-gray-300 rounded' : ''}`}>
                {loading ? 'Loading activity item...' : item.description}
              </p>
              <p className={`text-xs text-gray-500 ${loading ? 'text-gray-300 bg-gray-300 rounded w-40 mt-1' : ''}`}>
                {loading ? 'Loading...' : `${item.createdBy?.name} • ${new Date(item.timestamp).toLocaleDateString()}`}
              </p>
            </div>
          </div>
        ))}

        {!loading && activity.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </motion.div>
  )
})

export default RecentActivity