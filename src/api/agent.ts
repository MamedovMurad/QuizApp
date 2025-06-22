// src/lib/axios.ts
import axios from 'axios'
import { messageApi } from '../context/MessageContext'
 // path as needed

const api = axios.create({
  baseURL: 'https://quiz.honeybal.net/api',
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agent')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    messageApi.error('Failed to send request.')
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      messageApi.error('Unauthorized. Please login again.')
      window.location.href = '/login'
    } else if (status === 403) {
      messageApi.warning('You don’t have permission.')
      localStorage.clear();
        window.location.href = '/login'
    } else if (status === 404) {
      messageApi.info('Not found.')
    } else if (status >= 500) {
      messageApi.error(error.response?.data?.msg || 'Something went wrong.')
    } else {
      messageApi.error(error.response?.data?.message || 'Something went wrong.')
    }

    return Promise.reject(error)
  }
)

export default api
