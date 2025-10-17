import api from "./api"

export const listEvents = async (params = {}) => {
  const res = await api.get("/events", { params })
  return res.data?.data ? res.data : res.data
}

export const getEventById = async (id) => {
  const res = await api.get(`/events/${id}`)
  return res.data
}

export const createEvent = async (payload) => {
  const res = await api.post("/events", payload)
  return res.data
}

export const updateEvent = async (id, payload) => {
  const res = await api.put(`/events/${id}`, payload)
  return res.data
}

export const deleteEvent = async (id) => {
  const res = await api.delete(`/events/${id}`)
  return res.data
}
