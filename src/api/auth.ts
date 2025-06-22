// src/lib/auth.ts

import api from "./agent"


const TOKEN_KEY = 'agent'

export async function login(email: string, password: string) {
  try {
    const response = await api.post('/login', { email, password })
    const token = response.data.data.token

    console.log(token,);
    

    if (token) {
      localStorage.setItem('name',response.data.data.name)
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
      localStorage.setItem('name',response.data.data.name)
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

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY)
}

export const getMe=async()=>{
   const response = await api.get("/get-me")

   return response
}
