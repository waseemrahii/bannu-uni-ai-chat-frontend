import api from "./api"

export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/stats")
  return res.data
}

export const getUpcomingItems = async () => {
  const res = await api.get("/dashboard/upcoming")
  return res.data
}

export const getAnalytics = async () => {
  const res = await api.get("/dashboard/analytics")
  return res.data
}

export const getRecentActivity = async () => {
  const res = await api.get("/dashboard/activity")
  return res.data
}

export const getScheduleBreakdown = async () => {
  const res = await api.get("/dashboard/schedule-breakdown")
  return res.data
}

export const getUserStatistics = async () => {
  const res = await api.get("/dashboard/users")
  return res.data
}