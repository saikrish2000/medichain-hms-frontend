import api from './axios';

export const authApi = {
  login:          (data)           => api.post('/auth/login', data),
  register:       (data)           => api.post('/auth/register', data),
  logout:         ()               => api.post('/auth/logout'),
  forgotPassword: (email)          => api.post('/auth/forgot-password', { email }),
  resetPassword:  (token, data)    => api.post('/auth/reset-password', { token, ...data }),
  verifyEmail:    (token)          => api.get(`/auth/verify-email?token=${token}`),
  refreshToken:   (refreshToken)   => api.post('/auth/refresh', { refreshToken }),
  me:             ()               => api.get('/auth/me'),
};
