"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function DetalhesSolicitacao({ params }) {
  const [status, setStatus] = useState("Em análise")
  const [justificativa, setJustificativa] = useState("")

  // Simula dados da solicitação
  const solicitacao = {
    id: params.id,
    nome: "João Silva",
    matricula: "123456",
    curso: "Engenharia de Software",
    tipoAuxilio: "Moradia",
    motivo: "Dificuldades financeiras devido à perda de emprego dos pais.",
    dataSubmissao: "2023-05-01",
    documentos: ["comprovante_renda.pdf", "historico_escolar.pdf"],
  }

  const handleStatusChange = (novoStatus) => {
    setStatus(novoStatus)
  }

  const handleSalvarDecisao = () => {
    console.log("Status:", status)
    console.log("Justificativa:", justificativa)
    // Aqui você enviaria a decisão para o backend
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Detalhes da Solicitação</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Estudante</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Nome:</strong> {solicitacao.nome}
            </p>
            <p>
              <strong>Matrícula:</strong> {solicitacao.matricula}
            </p>
            <p>
              <strong>Curso:</strong> {solicitacao.curso}
            </p>
            <p>
              <strong>Tipo de Auxílio:</strong> {solicitacao.tipoAuxilio}
            </p>
            <p>
              <strong>Data de Submissão:</strong> {solicitacao.dataSubmissao}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Motivo da Solicitação</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{solicitacao.motivo}</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Documentos Anexados</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {solicitacao.documentos.map((doc, index) => (
              <li key={index} className="mb-2">
                <Button variant="outline" size="sm">
                  {doc}
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Decisão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Status</Label>
            <div className="flex space-x-2 mt-2">
              <Button
                variant={status === "Aprovado" ? "default" : "outline"}
                onClick={() => handleStatusChange("Aprovado")}
              >
                Aprovar
              </Button>
              <Button
                variant={status === "Indeferido" ? "default" : "outline"}
                onClick={() => handleStatusChange("Indeferido")}
              >
                Indeferir
              </Button>
              <Button
                variant={status === "Pendente" ? "default" : "outline"}
                onClick={() => handleStatusChange("Pendente")}
              >
                Pendente
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="justificativa">Justificativa</Label>
            <Textarea
              id="justificativa"
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              rows={4}
            />
          </div>
          <Button onClick={handleSalvarDecisao}>Salvar Decisão</Button>
        </CardContent>
      </Card>
    </div>
  )
}

