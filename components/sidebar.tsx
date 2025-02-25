"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, User, Users, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth"

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path) => pathname === path

  if (!user) return null

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-800 text-white">
      <div className="flex h-16 items-center justify-center">
        <h1 className="text-xl font-bold">Auxílio Emergencial UFC</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2 p-4">
          {user.role === "STUDENT" && (
            <>
              <li>
                <Link
                  href="/dashboard/estudante"
                  className={`flex items-center space-x-2 rounded p-2 ${isActive("/dashboard/estudante") ? "bg-gray-700" : "hover:bg-gray-700"}`}
                >
                  <Home size={20} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/solicitacao"
                  className={`flex items-center space-x-2 rounded p-2 ${isActive("/solicitacao") ? "bg-gray-700" : "hover:bg-gray-700"}`}
                >
                  <FileText size={20} />
                  <span>Nova Solicitação</span>
                </Link>
              </li>
            </>
          )}
          {user.role === "ADMIN" && (
            <>
              <li>
                <Link
                  href="/dashboard/admin"
                  className={`flex items-center space-x-2 rounded p-2 ${isActive("/dashboard/admin") ? "bg-gray-700" : "hover:bg-gray-700"}`}
                >
                  <Users size={20} />
                  <span>Painel Admin</span>
                </Link>
              </li>
            </>
          )}
          <li>
            <Link
              href="/perfil"
              className={`flex items-center space-x-2 rounded p-2 ${isActive("/perfil") ? "bg-gray-700" : "hover:bg-gray-700"}`}
            >
              <User size={20} />
              <span>Perfil</span>
            </Link>
          </li>
          <li>
            <button onClick={logout} className="flex w-full items-center space-x-2 rounded p-2 hover:bg-gray-700">
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

