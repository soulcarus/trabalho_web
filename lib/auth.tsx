"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { NextApiRequest } from "next/types"
import jwt from "jsonwebtoken"
import prisma from "./prisma"

interface User {
  id: string
  email: string
  name: string
  role: string
  matricula: string
  curso: string
  campus: string
}
interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  login: (data: any) => Promise<User>
  logout: () => void
  register: (data: any) => Promise<User>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: async () => ({ id: "", email: "", name: "", role: "", matricula: "", curso: "", campus: "" }),
  logout: () => {},
  register: async () => ({ id: "", email: "", name: "", role: "", matricula: "", curso: "", campus: "" }),
})

interface AuthProviderProps {
  children: ReactNode
}

interface AuthContextProps {
  user: {
    id: number
    name: string
    role: string
    matricula: string
    curso: string
    campus: string
  } | null
  login: (data: any) => Promise<any>
  register: (data: any) => Promise<any>
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetch("/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((userData) => {
          if (userData.id) {
            setUser(userData)
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error)
          localStorage.removeItem("token")
        })
    }
  }, [])

  const login = async (data: any) => {
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
      setUser({
        id: result.user.id,
        name: result.user.name,
        role: result.user.role,
        matricula: result.user.matricula,
        curso: result.user.curso,
        campus: result.user.campus,
      })
      return result.user
    } else {
      throw new Error(result.message)
    }
  }

  const register = async (data: any) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    const result = await response.json()

    if (response.ok) {
      router.push("/dashboard/estudante")
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

  return <AuthContext.Provider value={{ user, setUser, login, logout, register }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)


export async function getSession(req: NextApiRequest) {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return null
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set")
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, role: true, matricula: true, curso: true, campus: true },
    })

    if (!user) {
      return null
    }

    return { user }
  } catch (error) {
    return null
  }
}

