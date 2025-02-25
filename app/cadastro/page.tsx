"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

const schema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido" }),
  rg: z.string().min(7, { message: "RG inválido" }),
  rendaFamiliar: z.number().min(0, { message: "Renda familiar deve ser um valor positivo" }),
  composicaoFamiliar: z.number().int().min(1, { message: "Composição familiar deve ser pelo menos 1" }),
  matricula: z.string().regex(/^UFC-\d{5}$/, { message: "Matrícula deve estar no formato UFC-12345" }),
  curso: z.string().min(3, { message: "Curso deve ter pelo menos 3 caracteres" }),
})

export default function CadastroEstudante() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  const onSubmit = (data) => {
    console.log(data)
    // Aqui você pode adicionar a lógica para enviar os dados para o backend
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Cadastro do Estudante - Dados Pessoais</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome Completo</Label>
          <Input id="nome" {...register("nome")} />
          {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
        </div>
        <div>
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" {...register("cpf")} placeholder="000.000.000-00" />
          {errors.cpf && <p className="text-sm text-red-500">{errors.cpf.message}</p>}
        </div>
        <div>
          <Label htmlFor="rg">RG</Label>
          <Input id="rg" {...register("rg")} />
          {errors.rg && <p className="text-sm text-red-500">{errors.rg.message}</p>}
        </div>
        <div>
          <Label htmlFor="rendaFamiliar">Renda Familiar</Label>
          <Input id="rendaFamiliar" type="number" step="0.01" {...register("rendaFamiliar", { valueAsNumber: true })} />
          {errors.rendaFamiliar && <p className="text-sm text-red-500">{errors.rendaFamiliar.message}</p>}
        </div>
        <div>
          <Label htmlFor="composicaoFamiliar">Composição Familiar</Label>
          <Input id="composicaoFamiliar" type="number" {...register("composicaoFamiliar", { valueAsNumber: true })} />
          {errors.composicaoFamiliar && <p className="text-sm text-red-500">{errors.composicaoFamiliar.message}</p>}
        </div>
        <div className="relative">
          <Label htmlFor="matricula">
            Matrícula
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="ml-1 inline-block h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Formato: UFC-12345</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input id="matricula" {...register("matricula")} placeholder="UFC-12345" />
          {errors.matricula && <p className="text-sm text-red-500">{errors.matricula.message}</p>}
        </div>
        <div>
          <Label htmlFor="curso">Curso</Label>
          <Input id="curso" {...register("curso")} />
          {errors.curso && <p className="text-sm text-red-500">{errors.curso.message}</p>}
        </div>
        <Button type="submit" disabled={!isValid}>
          Próximo
        </Button>
      </form>
    </div>
  )
}

