"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PainelAssistenteSocial() {
  const [filtro, setFiltro] = useState({
    campus: "",
    tipoAuxilio: "",
    status: "",
  })

  const [busca, setBusca] = useState("")

  const solicitacoes = [
    { id: 1, nome: "João Silva", matricula: "UFC-12345", prioridade: "Alta" },
    { id: 2, nome: "Maria Santos", matricula: "UFC-67890", prioridade: "Média" },
    { id: 3, nome: "Pedro Oliveira", matricula: "UFC-54321", prioridade: "Baixa" },
  ]

  const handleFiltroChange = (campo, valor) => {
    setFiltro({ ...filtro, [campo]: valor })
  }

  const handleBuscaChange = (e) => {
    setBusca(e.target.value)
  }

  const solicitacoesFiltradas = solicitacoes.filter(
    (solicitacao) =>
      solicitacao.nome.toLowerCase().includes(busca.toLowerCase()) ||
      solicitacao.matricula.toLowerCase().includes(busca.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Painel do Assistente Social</h1>
      <div className="mb-6 flex flex-wrap gap-4">
        <Select onValueChange={(value) => handleFiltroChange("campus", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Campus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fortaleza">Fortaleza</SelectItem>
            <SelectItem value="sobral">Sobral</SelectItem>
            <SelectItem value="quixada">Quixadá</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => handleFiltroChange("tipoAuxilio", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de Auxílio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="saude">Saúde</SelectItem>
            <SelectItem value="transporte">Transporte</SelectItem>
            <SelectItem value="moradia">Moradia</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => handleFiltroChange("status", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="aprovado">Aprovado</SelectItem>
            <SelectItem value="rejeitado">Rejeitado</SelectItem>
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
            <TableHead>Prioridade</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitacoesFiltradas.map((solicitacao) => (
            <TableRow key={solicitacao.id}>
              <TableCell>{solicitacao.nome}</TableCell>
              <TableCell>{solicitacao.matricula}</TableCell>
              <TableCell>{solicitacao.prioridade}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Aprovar
                  </Button>
                  <Button size="sm" variant="outline">
                    Rejeitar
                  </Button>
                  <Button size="sm" variant="outline">
                    Solicitar Revisão
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Button>Exportar Relatório</Button>
      </div>
    </div>
  )
}

