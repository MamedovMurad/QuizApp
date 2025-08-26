// src/lib/auth.ts

import api from "./agent"


const TOKEN_KEY = 'agent'

export async function login(email: string, password: string) {
  try {
    const response = await api.post('/login', { email, password })
    const token = response.data.data.token

    console.log(token,);


    if (token) {
      localStorage.setItem('name', response.data.data.name)
      localStorage.setItem(TOKEN_KEY, token)
    }

    return response.data
  } catch (error) {
    throw error
  }
}

export async function ladminLogin(email: string, password: string) {
  try {
    const response = await api.post('/login', { email, password })
    const token = response.data.data.token

    console.log(token,);


    if (token) {
      localStorage.setItem('name', response.data.data.name)
      localStorage.setItem(TOKEN_KEY, token)
    }

    return response.data
  } catch (error) {
    throw error
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  window.location.href = '/login'
}

export async function register(
  { email, password, password_confirmation }
    : { email: string, password: string, password_confirmation: string }) {

  const response = await api.post('/register', { email, password, password_confirmation })
  return response
}

export async function sendOtp(
  { email, code }
    : { email: string, code: string }) {

  const response = await api.post('/verify', { email, code  })
  return response
}

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY)
}

export const getMe = async () => {
  const response = await api.get("/get-me")

  return response
}
