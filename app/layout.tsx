import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/sidebar"
import { AuthProvider } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sistema de Auxílio Emergencial - UFC",
  description: "Sistema de demanda espontânea do Auxílio Emergencial para Assistência Estudantil da UFC",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 bg-gray-100 p-8">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'