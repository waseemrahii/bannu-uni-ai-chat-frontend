// import api from "./api"

// export const listUsers = async () => {
//   const res = await api.get("/auth")
//   return res.data
// }

// export const deleteUser = async (id) => {
//   const res = await api.delete(`/auth/${id}`)
//   return res.data
// }

// export const registerCR = async (payload) => {
//   const res = await api.post("/auth/register", { ...payload, role: "cr" })
//   return res.data
// }

// export const getAllUsers = async (params = {}) => {
//   const res = await api.get("/auth", { params })
//   return res.data
// }

import api from "./api"

export const listUsers = async () => {
  const res = await api.get("/auth")
  return res.data
}

export const deleteUser = async (id) => {
  const res = await api.delete(`/auth/${id}`)
  return res.data
}

export const registerCR = async (payload) => {
  const res = await api.post("/auth/register", { ...payload, role: "cr" })
  return res.data
}

export const getAllUsers = async (params = {}) => {
  const res = await api.get("/auth", { params })
  return res.data
}

// Add this function for updating users
export const updateUser = async (id, payload) => {
  const res = await api.put(`/auth/${id}`, payload)
  return res.data
}