"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, Bell } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"

export default function DashboardEstudante() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requests")
        if (!response.ok) {
          throw new Error("Failed to fetch requests")
        }
        const data = await response.json()
        setRequests(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar solicitações",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequests()
  }, [])

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Dashboard do Estudante</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2" />
              Solicitações Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{requests.filter((r) => r.status === "PENDING").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2" />
              Próximo Prazo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">Em breve</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">0 novas</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Minhas Solicitações</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de Auxílio</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data da Solicitação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.type}</TableCell>
                <TableCell>
                  <Badge variant={request.status === "APPROVED" ? "success" : "secondary"}>{request.status}</Badge>
                </TableCell>
                <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/solicitacao/${request.id}`)}>
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-8">
        <Button onClick={() => router.push("/solicitacao")}>Nova Solicitação</Button>
      </div>
    </div>
  )
}

