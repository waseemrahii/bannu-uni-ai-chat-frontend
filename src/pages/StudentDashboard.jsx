import { useState, useEffect, useMemo, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { 
  Users, Calendar, BookOpen, BarChart3, Activity, 
  Clock, TrendingUp, Award, FileText, Megaphone,
  GraduationCap, Shield, UserCheck, Bell, Eye
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { getDashboardStats, getUpcomingItems, getAnalytics, getRecentActivity } from "../services/dashboardService"
import toast from "react-hot-toast"

// Lazy load heavy components
const StatsGrid = lazy(() => import('../components/dashboard/dashboard/StatsGrid'));
const UpcomingSection = lazy(() => import('../components/dashboard/dashboard/UpcomingSection'));
const AnalyticsSection = lazy(() => import('../components/dashboard/dashboard/AnalyticsSection'));
const RecentActivity = lazy(() => import('../components/dashboard/dashboard/RecentActivity'));

// Role-based colors and icons
const roleConfig = {
  admin: {
    color: "from-purple-600 to-purple-700",
    accent: "purple",
    icon: Shield,
    badge: "bg-purple-100 text-purple-800"
  },
  cr: {
    color: "from-green-600 to-green-700",
    accent: "green",
    icon: UserCheck,
    badge: "bg-green-100 text-green-800"
  },
  student: {
    color: "from-blue-600 to-blue-700",
    accent: "blue",
    icon: GraduationCap,
    badge: "bg-blue-100 text-blue-800"
  }
}

// Static fallback data
const staticData = {
  stats: {
    users: { total: 0, students: 0, crs: 0, admins: 0 },
    schedules: { total: 0, classes: 0, exams: 0, assignments: 0, quizzes: 0, tests: 0 },
    events: { total: 0, upcoming: 0, past: 0 },
    results: { total: 0, students: 0 },
    announcements: { total: 0 },
    chats: { total: 0 }
  },
  upcoming: { schedules: [], events: [] },
  analytics: null,
  activity: []
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(staticData)
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  const userRole = user?.role || "student"
  const roleInfo = roleConfig[userRole]

  // Memoized user info to prevent unnecessary re-renders
  const userInfo = useMemo(() => ({
    name: user?.name || "User",
    className: user?.className,
    semester: user?.semester,
    role: userRole
  }), [user?.name, user?.className, user?.semester, userRole])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    if (dataLoaded) return;
    
    setLoading(true)
    try {
      const [statsRes, upcomingRes, analyticsRes, activityRes] = await Promise.allSettled([
        getDashboardStats(),
        getUpcomingItems(),
        getAnalytics(),
        getRecentActivity()
      ])

      const newData = {
        stats: statsRes.status === 'fulfilled' ? statsRes.value.stats : staticData.stats,
        upcoming: upcomingRes.status === 'fulfilled' ? upcomingRes.value : staticData.upcoming,
        analytics: analyticsRes.status === 'fulfilled' ? analyticsRes.value.analytics : staticData.analytics,
        activity: activityRes.status === 'fulfilled' ? activityRes.value.activities || [] : staticData.activity
      }

      setDashboardData(newData)
      setDataLoaded(true)
    } catch (error) {
      console.error("Error loading dashboard:", error)
      // Keep static data if API fails
    } finally {
      setLoading(false)
    }
  }

  // Welcome Header Component (kept here since it's lightweight)
  const WelcomeHeader = ({ userInfo, roleInfo }) => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-blue-600 p-6 text-white shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {userInfo.name}!
          </h1>
          <p className="text-blue-100 text-lg">
            Here's what's happening in your {userInfo.role === 'admin' ? 'university' : userInfo.role === 'cr' ? 'class' : 'studies'} today.
          </p>
        </div>
        <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
          <roleInfo.icon className="w-8 h-8" />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleInfo.badge}`}>
          {userInfo.role.toUpperCase()}
        </span>
        {userInfo.className && userInfo.semester && (
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
            Class {userInfo.className} • Semester {userInfo.semester}
          </span>
        )}
      </div>
    </motion.div>
  )

  // Memoized header to prevent re-renders
  const MemoizedWelcomeHeader = useMemo(() => 
    <WelcomeHeader userInfo={userInfo} roleInfo={roleInfo} />, 
    [userInfo, roleInfo]
  )

  return (
    <div className="space-y-6">
      {MemoizedWelcomeHeader}

      {/* Stats Grid with Suspense */}
      <Suspense fallback={<StatsGridSkeleton userRole={userRole} />}>
        <StatsGrid 
          stats={dashboardData.stats} 
          userRole={userRole} 
          loading={loading && !dataLoaded}
        />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Section */}
        <Suspense fallback={<UpcomingSkeleton />}>
          <UpcomingSection 
            upcoming={dashboardData.upcoming} 
            loading={loading && !dataLoaded}
          />
        </Suspense>

        {/* Analytics Section */}
        <Suspense fallback={<AnalyticsSkeleton userRole={userRole} />}>
          <AnalyticsSection 
            analytics={dashboardData.analytics} 
            userRole={userRole}
            loading={loading && !dataLoaded}
          />
        </Suspense>
      </div>

      {/* Recent Activity (Admin & CR only) */}
      {(userRole === 'admin' || userRole === 'cr') && (
        <Suspense fallback={<ActivitySkeleton />}>
          <RecentActivity 
            activity={dashboardData.activity} 
            loading={loading && !dataLoaded}
          />
        </Suspense>
      )}
    </div>
  )
}

// Loading Skeletons
const StatsGridSkeleton = ({ userRole }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: userRole === 'admin' ? 6 : userRole === 'cr' ? 4 : 3 }).map((_, index) => (
      <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
)

const UpcomingSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-12 h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
)

const AnalyticsSkeleton = ({ userRole }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
)

const ActivitySkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
)
