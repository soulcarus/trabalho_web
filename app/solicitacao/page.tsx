"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const schema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  matricula: z.string().regex(/^\d{6}$/, { message: "Matrícula deve conter 6 dígitos" }),
  curso: z.string().min(3, { message: "Curso é obrigatório" }),
  motivo: z.string().min(50, { message: "Motivo deve ter pelo menos 50 caracteres" }),
  tipoAuxilio: z.enum(["moradia", "alimentacao", "transporte"], { required_error: "Selecione um tipo de auxílio" }),
})

export default function SolicitacaoAuxilio() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })
  const [documentos, setDocumentos] = useState([])

  const onSubmit = (data) => {
    console.log(data)
    console.log(documentos)
    // Aqui você enviaria os dados e documentos para o backend
  }

  const handleFileChange = (e) => {
    setDocumentos([...e.target.files])
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
        <div>
          <Label htmlFor="nome">Nome Completo</Label>
          <Input id="nome" {...register("nome")} />
          {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
        </div>
        <div>
          <Label htmlFor="matricula">Matrícula</Label>
          <Input id="matricula" {...register("matricula")} />
          {errors.matricula && <p className="text-sm text-red-500">{errors.matricula.message}</p>}
        </div>
        <div>
          <Label htmlFor="curso">Curso</Label>
          <Input id="curso" {...register("curso")} />
          {errors.curso && <p className="text-sm text-red-500">{errors.curso.message}</p>}
        </div>
        <div>
          <Label htmlFor="tipoAuxilio">Tipo de Auxílio</Label>
          <Select onValueChange={(value) => register("tipoAuxilio").onChange({ target: { value } })}>
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
          <Label htmlFor="motivo">Motivo da Solicitação</Label>
          <Textarea id="motivo" {...register("motivo")} rows={5} />
          {errors.motivo && <p className="text-sm text-red-500">{errors.motivo.message}</p>}
        </div>
        <div>
          <Label htmlFor="documentos">Documentos Comprobatórios</Label>
          <Input id="documentos" type="file" multiple onChange={handleFileChange} />
        </div>
        <Button type="submit">Enviar Solicitação</Button>
      </form>
    </div>
  )
}

