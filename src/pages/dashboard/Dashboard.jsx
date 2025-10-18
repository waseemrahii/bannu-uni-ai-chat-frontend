import { useState, useEffect, useMemo, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { 
  Users, Calendar, BookOpen, BarChart3, Activity, 
  Clock, TrendingUp, Award, FileText, Megaphone,
  GraduationCap, Shield, UserCheck, Bell, Eye
} from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { getDashboardStats, getUpcomingItems, getAnalytics, getRecentActivity } from "../../services/dashboardService"
import toast from "react-hot-toast"

// Lazy load heavy components
const StatsGrid = lazy(() => import('../../components/dashboard/dashboard/StatsGrid'));
const UpcomingSection = lazy(() => import('../../components/dashboard/dashboard/UpcomingSection'));
const AnalyticsSection = lazy(() => import('../../components/dashboard/dashboard/AnalyticsSection'));
const RecentActivity = lazy(() => import('../../components/dashboard/dashboard/RecentActivity'));

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

export default function Dashboard() {
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

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { 
//   Users, Calendar, BookOpen, BarChart3, Activity, 
//   Clock, TrendingUp, Award, FileText, Megaphone,
//   GraduationCap, Shield, UserCheck, Bell, Eye
// } from "lucide-react"
// import { useAuth } from "../../context/AuthContext"
// import { getDashboardStats, getUpcomingItems, getAnalytics, getRecentActivity } from "../../services/dashboardService"
// import toast from "react-hot-toast"

// // Role-based colors and icons
// const roleConfig = {
//   admin: {
//     color: "from-purple-600 to-purple-700",
//     accent: "purple",
//     icon: Shield,
//     badge: "bg-purple-100 text-purple-800"
//   },
//   cr: {
//     color: "from-green-600 to-green-700",
//     accent: "green",
//     icon: UserCheck,
//     badge: "bg-green-100 text-green-800"
//   },
//   student: {
//     color: "from-blue-600 to-blue-700",
//     accent: "blue",
//     icon: GraduationCap,
//     badge: "bg-blue-100 text-blue-800"
//   }
// }

// // Stats card configuration
// const statCards = {
//   admin: [
//     { key: "totalUsers", label: "Total Users", icon: Users, color: "bg-purple-500" },
//     { key: "totalSchedules", label: "Schedules", icon: Calendar, color: "bg-blue-500" },
//     { key: "totalEvents", label: "Events", icon: Megaphone, color: "bg-green-500" },
//     { key: "totalResults", label: "Results", icon: Award, color: "bg-orange-500" },
//     { key: "totalAnnouncements", label: "Announcements", icon: Bell, color: "bg-red-500" },
//     { key: "totalChats", label: "Chats", icon: Activity, color: "bg-indigo-500" }
//   ],
//   cr: [
//     { key: "totalStudents", label: "Students", icon: Users, color: "bg-green-500" },
//     { key: "totalSchedules", label: "Schedules", icon: Calendar, color: "bg-blue-500" },
//     { key: "totalEvents", label: "Events", icon: Megaphone, color: "bg-purple-500" },
//     { key: "totalResults", label: "Results", icon: Award, color: "bg-orange-500" }
//   ],
//   student: [
//     { key: "totalSchedules", label: "My Schedules", icon: Calendar, color: "bg-blue-500" },
//     { key: "totalEvents", label: "Events", icon: Megaphone, color: "bg-purple-500" },
//     { key: "totalResults", label: "My Results", icon: Award, color: "bg-green-500" }
//   ]
// }

// export default function Dashboard() {
//   const { user } = useAuth()
//   const [stats, setStats] = useState(null)
//   const [upcoming, setUpcoming] = useState({ schedules: [], events: [] })
//   const [analytics, setAnalytics] = useState(null)
//   const [activity, setActivity] = useState([])
//   const [loading, setLoading] = useState(true)

//   const userRole = user?.role || "student"
//   const roleInfo = roleConfig[userRole]

//   useEffect(() => {
//     loadDashboardData()
//   }, [])

//   const loadDashboardData = async () => {
//     setLoading(true)
//     try {
//       const [statsRes, upcomingRes, analyticsRes, activityRes] = await Promise.all([
//         getDashboardStats(),
//         getUpcomingItems(),
//         getAnalytics(),
//         getRecentActivity()
//       ])

//       setStats(statsRes.stats)
//       setUpcoming(upcomingRes)
//       setAnalytics(analyticsRes.analytics)
//       setActivity(activityRes.activities || [])
//     } catch (error) {
//       toast.error("Failed to load dashboard data")
//       console.error("Error loading dashboard:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Calculate derived stats for cards
//   const getStatValue = (key) => {
//     if (!stats) return 0
    
//     const keyMap = {
//       totalUsers: stats.users?.total || 0,
//       totalStudents: stats.users?.students || 0,
//       totalSchedules: stats.schedules?.total || 0,
//       totalEvents: stats.events?.total || 0,
//       totalResults: stats.results?.total || 0,
//       totalAnnouncements: stats.announcements?.total || 0,
//       totalChats: stats.chats?.total || 0
//     }
    
//     return keyMap[key] || 0
//   }

//   // Format date for display
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     })
//   }

//   // Get days until event
//   const getDaysUntil = (dateString) => {
//     const today = new Date()
//     const eventDate = new Date(dateString)
//     const diffTime = eventDate - today
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//     return diffDays
//   }

//   if (loading) {
//     return <DashboardSkeleton roleInfo={roleInfo} />
//   }

//   return (
//     <div className="space-y-6">
//       {/* Welcome Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={`rounded-2xl bg-[#1e40af] p-6 text-white shadow-lg`}
//       >
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold mb-2">
//               Welcome back, {user?.name}!
//             </h1>
//             <p className="text-blue-100 text-lg">
//               Here's what's happening in your {userRole === 'admin' ? 'university' : userRole === 'cr' ? 'class' : 'studies'} today.
//             </p>
//           </div>
//           <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
//             <roleInfo.icon className="w-8 h-8" />
//           </div>
//         </div>
        
//         {/* Role Badge */}
//         <div className="flex items-center gap-2 mt-4">
//           <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleInfo.badge}`}>
//             {userRole.toUpperCase()}
//           </span>
//           {user?.className && user?.semester && (
//             <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
//               Class {user.className} • Semester {user.semester}
//             </span>
//           )}
//         </div>
//       </motion.div>

//       {/* Stats Grid */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1 }}
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//       >
//         {statCards[userRole].map((card, index) => {
//           const Icon = card.icon
//           return (
//             <div
//               key={card.key}
//               className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">{card.label}</p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">
//                     {getStatValue(card.key).toLocaleString()}
//                   </p>
//                 </div>
//                 <div className={`p-3 rounded-lg ${card.color} text-white`}>
//                   <Icon className="w-6 h-6" />
//                 </div>
//               </div>
              
//               {/* Additional role-specific stats */}
//               {userRole === 'admin' && card.key === 'totalUsers' && (
//                 <div className="flex gap-4 mt-3 text-xs text-gray-500">
//                   <span>Students: {stats?.users?.students || 0}</span>
//                   <span>CRs: {stats?.users?.crs || 0}</span>
//                   <span>Admins: {stats?.users?.admins || 0}</span>
//                 </div>
//               )}
              
//               {userRole === 'admin' && card.key === 'totalSchedules' && (
//                 <div className="flex gap-4 mt-3 text-xs text-gray-500">
//                   <span>Classes: {stats?.schedules?.classes || 0}</span>
//                   <span>Exams: {stats?.schedules?.exams || 0}</span>
//                 </div>
//               )}
//             </div>
//           )
//         })}
//       </motion.div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Upcoming Schedules & Events */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//               <Clock className="w-5 h-5 text-blue-500" />
//               Upcoming
//             </h2>
//             <span className="text-sm text-gray-500">
//               Next 30 days
//             </span>
//           </div>

//           <div className="space-y-4">
//             {/* Upcoming Schedules */}
//             {upcoming.schedules?.slice(0, 5).map((schedule, index) => (
//               <div key={schedule._id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
//                 <div className={`w-3 h-3 rounded-full ${
//                   schedule.kind === 'class' ? 'bg-blue-500' :
//                   schedule.kind === 'exam' ? 'bg-red-500' :
//                   schedule.kind === 'assignment' ? 'bg-green-500' : 'bg-purple-500'
//                 }`} />
//                 <div className="flex-1 min-w-0">
//                   <p className="font-medium text-gray-900 text-sm truncate">
//                     {schedule.title}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {schedule.kind} • {formatDate(schedule.date)}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs font-medium text-gray-900">
//                     {getDaysUntil(schedule.date)} days
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {schedule.startTime}
//                   </p>
//                 </div>
//               </div>
//             ))}

//             {/* Upcoming Events */}
//             {upcoming.events?.slice(0, 3).map((event, index) => (
//               <div key={event._id} className="flex items-center gap-4 p-3 rounded-lg border border-yellow-100 bg-yellow-50">
//                 <div className="w-3 h-3 rounded-full bg-yellow-500" />
//                 <div className="flex-1 min-w-0">
//                   <p className="font-medium text-gray-900 text-sm truncate">
//                     {event.title}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Event • {formatDate(event.date)}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs font-medium text-gray-900">
//                     {getDaysUntil(event.date)} days
//                   </p>
//                 </div>
//               </div>
//             ))}

//             {(upcoming.schedules?.length === 0 && upcoming.events?.length === 0) && (
//               <div className="text-center py-8 text-gray-500">
//                 <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                 <p>No upcoming items</p>
//               </div>
//             )}
//           </div>
//         </motion.div>

//         {/* Analytics & Performance */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//               <TrendingUp className="w-5 h-5 text-green-500" />
//               {userRole === 'student' ? 'My Performance' : 'Analytics'}
//             </h2>
//           </div>

//           {userRole === 'admin' && analytics && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
//                   <p className="text-2xl font-bold text-green-600">{analytics.passRate}%</p>
//                   <p className="text-sm text-green-700">Pass Rate</p>
//                 </div>
//                 <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
//                   <p className="text-2xl font-bold text-red-600">{analytics.failRate}%</p>
//                   <p className="text-sm text-red-700">Fail Rate</p>
//                 </div>
//               </div>
              
//               {analytics.gradeDistribution && (
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-900 mb-3">Grade Distribution</h3>
//                   <div className="space-y-2">
//                     {Object.entries(analytics.gradeDistribution).map(([grade, count]) => (
//                       <div key={grade} className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">Grade {grade}</span>
//                         <span className="font-medium">{count}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {userRole === 'cr' && analytics && (
//             <div className="space-y-4">
//               <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
//                 <p className="text-2xl font-bold text-blue-600">{analytics.totalStudents}</p>
//                 <p className="text-sm text-blue-700">Students in Class</p>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
//                   <p className="text-lg font-bold text-green-600">{analytics.passRate}%</p>
//                   <p className="text-xs text-green-700">Pass Rate</p>
//                 </div>
//                 <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
//                   <p className="text-lg font-bold text-red-600">{analytics.failRate}%</p>
//                   <p className="text-xs text-red-700">Fail Rate</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {userRole === 'student' && analytics && (
//             <div className="space-y-4">
//               <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
//                 <p className="text-2xl font-bold text-blue-600">{analytics.totalResults}</p>
//                 <p className="text-sm text-blue-700">Published Results</p>
//               </div>
              
//               {analytics.results && analytics.results.length > 0 && (
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Results</h3>
//                   <div className="space-y-2">
//                     {analytics.results.slice(0, 3).map((result, index) => (
//                       <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
//                         <span className="text-sm">Semester {result.semester}</span>
//                         <span className="font-medium">{result.averageMarks}%</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {!analytics && (
//             <div className="text-center py-8 text-gray-500">
//               <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//               <p>No analytics data available</p>
//             </div>
//           )}
//         </motion.div>
//       </div>

//       {/* Recent Activity (Admin & CR only) */}
//       {(userRole === 'admin' || userRole === 'cr') && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//               <Activity className="w-5 h-5 text-purple-500" />
//               Recent Activity
//             </h2>
//           </div>

//           <div className="space-y-3">
//             {activity.slice(0, 8).map((item, index) => (
//               <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
//                 <div className={`w-2 h-2 rounded-full ${
//                   item.type.includes('schedule') ? 'bg-blue-500' :
//                   item.type.includes('event') ? 'bg-green-500' :
//                   item.type.includes('result') ? 'bg-orange-500' : 'bg-purple-500'
//                 }`} />
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-900">{item.description}</p>
//                   <p className="text-xs text-gray-500">
//                     {item.createdBy?.name} • {new Date(item.timestamp).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             ))}

//             {activity.length === 0 && (
//               <div className="text-center py-8 text-gray-500">
//                 <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                 <p>No recent activity</p>
//               </div>
//             )}
//           </div>
//         </motion.div>
//       )}
//     </div>
//   )
// }

// // Loading Skeleton
// const DashboardSkeleton = ({ roleInfo }) => (
//   <div className="space-y-6">
//     {/* Header Skeleton */}
//     <div className={`rounded-2xl bg-gradient-to-r ${roleInfo.color} p-6 text-white shadow-lg animate-pulse`}>
//       <div className="flex items-center justify-between">
//         <div className="space-y-3">
//           <div className="h-8 bg-white/20 rounded w-48"></div>
//           <div className="h-4 bg-white/20 rounded w-64"></div>
//         </div>
//         <div className="w-16 h-16 bg-white/20 rounded-full"></div>
//       </div>
//       <div className="flex gap-2 mt-4">
//         <div className="h-6 bg-white/20 rounded w-20"></div>
//         <div className="h-6 bg-white/20 rounded w-32"></div>
//       </div>
//     </div>

//     {/* Stats Grid Skeleton */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {Array.from({ length: 6 }).map((_, index) => (
//         <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
//           <div className="flex items-center justify-between">
//             <div className="space-y-2">
//               <div className="h-4 bg-gray-200 rounded w-20"></div>
//               <div className="h-6 bg-gray-200 rounded w-12"></div>
//             </div>
//             <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
//           </div>
//         </div>
//       ))}
//     </div>

//     {/* Content Skeleton */}
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
//         <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
//         <div className="space-y-4">
//           {Array.from({ length: 4 }).map((_, index) => (
//             <div key={index} className="flex items-center gap-4">
//               <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
//               <div className="flex-1 space-y-2">
//                 <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                 <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//               </div>
//               <div className="w-12 h-4 bg-gray-200 rounded"></div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
//         <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="h-20 bg-gray-200 rounded"></div>
//             <div className="h-20 bg-gray-200 rounded"></div>
//           </div>
//           <div className="space-y-2">
//             {Array.from({ length: 3 }).map((_, index) => (
//               <div key={index} className="h-4 bg-gray-200 rounded"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )