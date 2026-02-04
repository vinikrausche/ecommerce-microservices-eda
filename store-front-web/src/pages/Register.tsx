import { useState, type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUser, storeUserId } from "@/services/users"
import { useToast } from "@/hooks/use-toast"

type RegisterFormState = {
  name: string
  lastname: string
  email: string
  address: string
  zipcode: string
  national_id: string
  phone: string
  state: string
  password: string
}

const initialState: RegisterFormState = {
  name: "",
  lastname: "",
  email: "",
  address: "",
  zipcode: "",
  national_id: "",
  phone: "",
  state: "",
  password: "",
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterFormState>(initialState)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        state: form.state.trim().toUpperCase(),
      }
      const created = await createUser(payload)
      storeUserId(created.id)
      setForm(initialState)
      toast({
        title: "Cadastro realizado",
        description: "Agora voce pode fazer login com seu email.",
      })
      navigate("/", {
        replace: true,
        state: { openLogin: true, prefillEmail: created.email },
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: "Nao foi possivel cadastrar. Tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5]">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-12">
        <div className="w-full rounded-3xl border border-[#2a2a2a] bg-[#161616] p-8 shadow-2xl">
          <div className="mb-8 space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D8CFC4]">
              Cadastro
            </p>
            <h1 className="font-['Playfair_Display'] text-3xl">
              Crie sua conta para continuar
            </h1>
            <p className="text-sm text-[#D8CFC4]/80">
              Preencha os dados para registrar e depois faca login.
            </p>
          </div>

          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Sobrenome</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  placeholder="Seu sobrenome"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="voce@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Celular</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereco</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Rua, numero e bairro"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="zipcode">CEP</Label>
                <Input
                  id="zipcode"
                  name="zipcode"
                  value={form.zipcode}
                  onChange={handleChange}
                  placeholder="00000-000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">UF</Label>
                <Input
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="SP"
                  maxLength={2}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="national_id">CPF</Label>
                <Input
                  id="national_id"
                  name="national_id"
                  value={form.national_id}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Crie uma senha"
                required
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                className="bg-[#6B3E26] text-[#F5F5F5] hover:bg-[#7b4a30]"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-[#2a2a2a] text-[#F5F5F5] hover:bg-[#2a2a2a]"
                onClick={() => navigate("/")}
              >
                Voltar para a loja
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
