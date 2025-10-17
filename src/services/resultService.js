import api from "./api"

export const createResult = async (payload) => {
  const res = await api.post("/results", payload)
  return res.data
}

export const getResultByRoll = async (rollNo) => {
  const res = await api.get(`/results/roll/${encodeURIComponent(rollNo)}`)
  return res.data
}

export const getAllResults = async (params = {}) => {
  const res = await api.get("/results", { params })
  return res.data
}

export const updateResult = async (id, payload) => {
  const res = await api.put(`/results/${id}`, payload)
  return res.data
}

export const deleteResult = async (id) => {
  const res = await api.delete(`/results/${id}`)
  return res.data
}