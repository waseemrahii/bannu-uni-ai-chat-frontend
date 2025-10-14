// import api from './api';

// export const authService = {
//   login: (email, password) => {
//     return api.post('/auth/login', { email, password });
//   },

//   register: (userData) => {
//     return api.post('/auth/register', userData);
//   },

//   getProfile: (userId) => {
//     return api.get(`/auth/profile/${userId}`);
//   },

//   updateProfile: (userData) => {
//     return api.put('/auth/update-profile', userData);
//   },

//   changePassword: (passwordData) => {
//     return api.put('/auth/change-password', passwordData);
//   },
// };

import api from "./api"

export const authService = {
  login: (email, password) => {
    return api.post("/auth/login", { email, password })
  },

  register: (userData) => {
    return api.post("/auth/register", userData)
  },

  getProfile: (userId) => {
    return api.get(`/auth/profile/${userId}`)
  },

  updateProfile: (userData) => {
    return api.put("/auth/update-profile", userData)
  },

  changePassword: (passwordData) => {
    return api.put("/auth/change-password", passwordData)
  },

  forgotPassword: (email) => {
    return api.post("/auth/forgot-password", { email })
  },

  resetPassword: (token, newPassword) => {
    return api.post(`/auth/reset-password/${token}`, { newPassword })
  },
}
