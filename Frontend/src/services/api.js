import axios from 'axios'

const BACKEND_URL = 'https://artesanos-production-6d7a.up.railway.app'

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
export const getMediaUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BACKEND_URL}${path}`
}