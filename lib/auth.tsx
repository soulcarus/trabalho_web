"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import type { NextApiRequest } from "next"
import jwt from "jsonwebtoken"

const AuthContext = createContext<{
  user: any | null
  login: (data: any) => Promise<any>
  register: (data: any) => Promise<any>
  logout: () => void
}>({
  user: null,
  login: async () => null,
  register: async () => null,
  logout: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        setUser(decoded)
      } catch (error) {
        localStorage.removeItem("token")
        setUser(null)
      }
    }
  }, [])

  const login = async (data) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      localStorage.setItem("token", result.token)
      setUser(result.user)
      return result.user
    } else {
      throw new Error(result.message)
    }
  }

  const register = async (data) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      localStorage.setItem("token", result.token)
      setUser(result.user)
      return result.user
    } else {
      throw new Error(result.message)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export function getSession(req: NextApiRequest) {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return { user: decoded }
  } catch (error) {
    return null
  }
}

