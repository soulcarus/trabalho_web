"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"

export default function PerfilPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [user, router])

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Perfil do Usuário</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Nome:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Matrícula:</strong> {user.matricula}
            </div>
            <div>
              <strong>Papel:</strong> {user.role}
            </div>
            <Button variant="outline" onClick={logout}>
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}