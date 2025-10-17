

import api from "./api"

export const listSchedules = async (params = {}) => {
  const res = await api.get("/schedules", { params })
  return res.data
}

export const getScheduleById = async (id) => {
  const res = await api.get(`/schedules/${id}`)
  return res.data
}

export const createSchedule = async (payload) => {
  const res = await api.post("/schedules", payload)
  return res.data
}

export const updateSchedule = async (id, payload) => {
  const res = await api.put(`/schedules/${id}`, payload)
  return res.data
}

export const deleteSchedule = async (id) => {
  const res = await api.delete(`/schedules/${id}`)
  return res.data
}

// New function to get schedules by kind
export const getSchedulesByKind = async (kind) => {
  const res = await api.get("/schedules", { params: { kind } })
  return res.data
}

// New function to get schedules by day
export const getSchedulesByDay = async (day) => {
  const res = await api.get("/schedules", { params: { day } })
  return res.data
}