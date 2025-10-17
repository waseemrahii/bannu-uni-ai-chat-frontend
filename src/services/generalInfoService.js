import api from "./api"

export const createGeneralInfo = async (payload) => {
  const res = await api.post("/general-info", payload)
  return res.data
}

export const listGeneralInfo = async (params = {}) => {
  const res = await api.get("/general-info", { params })
  return res.data
}

export const updateGeneralInfo = async (id, payload) => {
  const res = await api.put(`/general-info/${id}`, payload)
  return res.data
}

export const deleteGeneralInfo = async (id) => {
  const res = await api.delete(`/general-info/${id}`)
  return res.data
}

export const getGeneralInfoById = async (id) => {
  const res = await api.get(`/general-info/${id}`)
  return res.data
}