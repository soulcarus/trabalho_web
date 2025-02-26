"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

const schema = z.object({
  motivo: z.string().min(50, { message: "Motivo deve ter pelo menos 50 caracteres" }),
  tipoAuxilio: z.enum(["moradia", "alimentacao", "transporte"], { required_error: "Selecione um tipo de auxílio" }),
})

export default function SolicitacaoAuxilio() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  })
  const [documentos, setDocumentos] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("motivo", data.motivo)
    formData.append("tipoAuxilio", data.tipoAuxilio)
    documentos.forEach((doc) => formData.append("documents", doc))

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })
      if (!response.ok) {
        throw new Error("Erro ao enviar solicitação")
      }
      const result = await response.json()
      console.log("Resposta do servidor:", result)
      toast({
        title: "Sucesso",
        description: "Solicitação enviada com sucesso",
      })
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error)
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e) => {
    setDocumentos([...e.target.files])
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Solicitação de Auxílio Emergencial</h1>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Atenção</AlertTitle>
        <AlertDescription>
          Certifique-se de preencher todos os campos corretamente e anexar todos os documentos necessários.
        </AlertDescription>
      </Alert>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="font-semibold mb-2">Informações do Estudante</h2>
          <p>
            <strong>Nome:</strong> {user.name}
          </p>
          <p>
            <strong>Matrícula:</strong> {user.matricula}
          </p>
          <p>
            <strong>Curso:</strong> {user.curso.replace("_", " ")}
          </p>
          <p>
            <strong>Campus:</strong> {user.campus}
          </p>
        </div>
        <div>
          <label htmlFor="tipoAuxilio">Tipo de Auxílio</label>
          <Select onValueChange={(value) => setValue("tipoAuxilio", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de auxílio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="moradia">Moradia</SelectItem>
              <SelectItem value="alimentacao">Alimentação</SelectItem>
              <SelectItem value="transporte">Transporte</SelectItem>
            </SelectContent>
          </Select>
          {errors.tipoAuxilio && <p className="text-sm text-red-500">{errors.tipoAuxilio.message}</p>}
        </div>
        <div>
          <label htmlFor="motivo">Motivo da Solicitação</label>
          <Textarea id="motivo" {...register("motivo")} rows={5} />
          {errors.motivo && <p className="text-sm text-red-500">{errors.motivo.message}</p>}
        </div>
        <div>
          <label htmlFor="documentos">Documentos Comprobatórios</label>
          <input id="documentos" type="file" multiple onChange={handleFileChange} className="w-full" />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
        </Button>
      </form>
    </div>
  )
}

