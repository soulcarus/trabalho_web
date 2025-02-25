"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"

export default function PainelAdmin() {
  const [requests, setRequests] = useState([])
  const [filtro, setFiltro] = useState({
    tipoAuxilio: "",
    status: "",
  })
  const [busca, setBusca] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      router.push("/dashboard/estudante")
    }
  }, [user, router])

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

  const handleFiltroChange = (campo, valor) => {
    setFiltro({ ...filtro, [campo]: valor })
  }

  const handleBuscaChange = (e) => {
    setBusca(e.target.value)
  }

  const requestosFiltrados = requests.filter(
    (request) =>
      (filtro.tipoAuxilio ? request.type === filtro.tipoAuxilio : true) &&
      (filtro.status ? request.status === filtro.status : true) &&
      (busca
        ? request.user.name.toLowerCase().includes(busca.toLowerCase()) || request.user.matricula.includes(busca)
        : true),
  )

  if (user?.role !== "ADMIN") {
    return null
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Painel Administrativo</h1>
      <div className="mb-6 flex flex-wrap gap-4">
        <Select onValueChange={(value) => handleFiltroChange("tipoAuxilio", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de Auxílio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="moradia">Moradia</SelectItem>
            <SelectItem value="alimentacao">Alimentação</SelectItem>
            <SelectItem value="transporte">Transporte</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => handleFiltroChange("status", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pendente</SelectItem>
            <SelectItem value="APPROVED">Aprovado</SelectItem>
            <SelectItem value="REJECTED">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Buscar por nome ou matrícula"
          value={busca}
          onChange={handleBuscaChange}
          className="w-full md:w-auto"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Matrícula</TableHead>
            <TableHead>Tipo de Auxílio</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data da Solicitação</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requestosFiltrados.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.user.name}</TableCell>
              <TableCell>{request.user.matricula}</TableCell>
              <TableCell>{request.type}</TableCell>
              <TableCell>
                <Badge variant={request.status === "APPROVED" ? "success" : "secondary"}>{request.status}</Badge>
              </TableCell>
              <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/admin/solicitacao/${request.id}`)}
                >
                  Ver Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Button
          onClick={() => {
            /* Implementar exportação de relatório */
          }}
        >
          Exportar Relatório
        </Button>
      </div>
    </div>
  )
}

