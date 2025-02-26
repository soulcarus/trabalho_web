"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [loginData, setLoginData] = useState({ matricula: "", password: "" })
  const [registerData, setRegisterData] = useState({
    matricula: "",
    email: "",
    password: "",
    name: "",
    campus: "RUSSAS",
    curso: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, register } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const user = await login(loginData)
      if (user.role === "ADMIN") {
        router.push("/dashboard/admin")
      } else {
        router.push("/dashboard/estudante")
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const user = await register(registerData)
      router.push("/dashboard/estudante")
    } catch (error) {
      toast({
        title: "Erro no registro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <img src="/placeholder.svg?height=100&width=100" alt="Logo da UFC" className="mx-auto h-20 w-20" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Auxílio Emergencial UFC</h2>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Registro</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="mt-8 space-y-12">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="login-matricula">Matrícula</Label>
                  <Input
                    id="login-matricula"
                    name="matricula"
                    value={loginData.matricula}
                    onChange={(e) => setLoginData({ ...loginData, matricula: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="register-matricula">Matrícula</Label>
                  <Input
                    id="register-matricula"
                    name="matricula"
                    value={registerData.matricula}
                    onChange={(e) => setRegisterData({ ...registerData, matricula: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="register-email">E-mail Institucional</Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="register-name">Nome Completo</Label>
                  <Input
                    id="register-name"
                    name="name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="register-campus">Campus</Label>
                  <Select
                    onValueChange={(value) => setRegisterData({ ...registerData, campus: value })}
                    defaultValue="RUSSAS"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o campus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RUSSAS">Russas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="register-curso">Curso</Label>
                  <Select onValueChange={(value) => setRegisterData({ ...registerData, curso: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENG_SOFTWARE">Engenharia de Software</SelectItem>
                      <SelectItem value="ENG_MECANICA">Engenharia Mecânica</SelectItem>
                      <SelectItem value="ENG_CIVIL">Engenharia Civil</SelectItem>
                      <SelectItem value="ENG_PRODUCAO">Engenharia de Produção</SelectItem>
                      <SelectItem value="CIENCIA_COMPUTACAO">Ciência da Computação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

