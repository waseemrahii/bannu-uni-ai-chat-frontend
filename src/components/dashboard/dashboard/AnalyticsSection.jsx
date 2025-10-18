import { memo } from "react"
import { motion } from "framer-motion"
import { TrendingUp, BarChart3 } from "lucide-react"

const AnalyticsSection = memo(({ analytics, userRole, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          {userRole === 'student' ? 'My Performance' : 'Analytics'}
        </h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : userRole === 'admin' && analytics ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-2xl font-bold text-green-600">{analytics.passRate}%</p>
              <p className="text-sm text-green-700">Pass Rate</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-2xl font-bold text-red-600">{analytics.failRate}%</p>
              <p className="text-sm text-red-700">Fail Rate</p>
            </div>
          </div>
          
          {analytics.gradeDistribution && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Grade Distribution</h3>
              <div className="space-y-2">
                {Object.entries(analytics.gradeDistribution).map(([grade, count]) => (
                  <div key={grade} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Grade {grade}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : userRole === 'cr' && analytics ? (
        <div className="space-y-4">
          <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{analytics.totalStudents}</p>
            <p className="text-sm text-blue-700">Students in Class</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-lg font-bold text-green-600">{analytics.passRate}%</p>
              <p className="text-xs text-green-700">Pass Rate</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-lg font-bold text-red-600">{analytics.failRate}%</p>
              <p className="text-xs text-red-700">Fail Rate</p>
            </div>
          </div>
        </div>
      ) : userRole === 'student' && analytics ? (
        <div className="space-y-4">
          <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{analytics.totalResults}</p>
            <p className="text-sm text-blue-700">Published Results</p>
          </div>
          
          {analytics.results && analytics.results.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Results</h3>
              <div className="space-y-2">
                {analytics.results.slice(0, 3).map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm">Semester {result.semester}</span>
                    <span className="font-medium">{result.averageMarks}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No analytics data available</p>
        </div>
      )}
    </motion.div>
  )
})

export default AnalyticsSection