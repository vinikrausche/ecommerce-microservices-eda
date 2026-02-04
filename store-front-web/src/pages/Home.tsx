import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Skeleton from "@/components/Skeleton"
import { placeholderImage, type Product } from "@/data/products"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fetchProducts } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import {
  clearStoredToken,
  getStoredToken,
  loginUser,
  storeToken,
} from "@/services/users"

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)

const normalizePhoto = (photo: string) => {
  if (photo.startsWith("data:") || photo.startsWith("http")) {
    return photo
  }
  return `data:image/webp;base64,${photo}`
}

const IconCart = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 2-1.5L21 7H7" />
  </svg>
)

const IconUser = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4 20c1.8-3.5 5-5 8-5s6.2 1.5 8 5" />
  </svg>
)

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(() =>
    getStoredToken()
  )
  const [addingProducts, setAddingProducts] = useState<Record<string, boolean>>(
    {}
  )
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { count: cartCount, addItem } = useCart()

  useEffect(() => {
    let isMounted = true
    fetchProducts()
      .then((data) => {
        if (!isMounted) return
        const mapped = data.map((item) => ({
          id: String(item.id),
          title: item.titulo,
          price: formatPrice(item.preco),
          quantity: `${item.quantidade} unidades`,
          description: item.descricao,
          photos:
            item.fotos && item.fotos.length > 0
              ? item.fotos.map(normalizePhoto)
              : [placeholderImage("BOTA")],
          highlights: ["Couro premium", "Conforto imediato", "Acabamento manual"],
          details: [
            { label: "Cor", value: "Marrom café" },
            { label: "Solado", value: "Emborrachado antiderrapante" },
            { label: "Estilo", value: "Masculino premium" },
          ],
        }))
        setProducts(mapped)
        setLoadError(false)
      })
      .catch(() => {
        if (!isMounted) return
        setProducts([])
        setLoadError(true)
      })
      .finally(() => {
        if (!isMounted) return
        setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const state = location.state as
      | { openLogin?: boolean; prefillEmail?: string }
      | null
    if (state?.openLogin) {
      setLoginEmail(state.prefillEmail ?? "")
      setIsLoginOpen(true)
      navigate(".", { replace: true, state: null })
    }
  }, [location.state, navigate])

  useEffect(() => {
    if (!isUserMenuOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current) return
      if (!userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginLoading(true)
    setLoginError(null)
    try {
      const token = await loginUser({
        email: loginEmail,
        password: loginPassword,
      })
      storeToken(token)
      setAuthToken(token)
      setIsLoginOpen(false)
      setLoginPassword("")
    } catch (err) {
      setLoginError("Nao foi possivel entrar. Verifique seus dados.")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    clearStoredToken()
    setAuthToken(null)
    setIsUserMenuOpen(false)
  }

  const handleAddToCart = async (productId: string) => {
    const numericId = Number(productId)
    if (!Number.isFinite(numericId)) {
      toast({
        variant: "destructive",
        title: "Produto invalido",
        description: "Nao foi possivel adicionar este item ao carrinho.",
      })
      return
    }

    setAddingProducts((prev) => ({ ...prev, [productId]: true }))
    try {
      await addItem(numericId)
      toast({
        title: "Adicionado ao carrinho",
        description: "O produto foi incluido no seu carrinho.",
      })
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: "Nao foi possivel adicionar ao carrinho agora.",
      })
    } finally {
      setAddingProducts((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const headerSubtitle = useMemo(
    () =>
      loading
        ? "Carregando coleção..."
        : `${products.length} modelos selecionados`,
    [loading, products.length]
  )

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5]">
      <header className="border-b border-[#2a2a2a] bg-[#121212]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2c2c2c] bg-[#1b1b1b] text-sm font-semibold">
              BR
            </div>
            <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D8CFC4]">
              Bota Royale
            </p>
            <p className="font-['Playfair_Display'] text-lg font-semibold">
              Botas Masculinas Premium
            </p>
            <p className="text-xs text-[#D8CFC4]/70">{headerSubtitle}</p>
          </div>
        </div>
          <div className="flex items-center gap-3">
            {authToken ? (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  className="h-10 border border-[#2a2a2a] bg-[#1a1a1a] text-[#F5F5F5] hover:bg-[#6B3E26] hover:text-[#F5F5F5]"
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  aria-label="Conta"
                >
                  <IconUser />
                </Button>
                {isUserMenuOpen ? (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-2 text-sm shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-[#F5F5F5] hover:bg-[#2a2a2a]"
                      onClick={handleLogout}
                    >
                      Sair
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Button
                variant="ghost"
                className="h-10 border border-[#2a2a2a] bg-[#1a1a1a] text-[#F5F5F5] hover:bg-[#6B3E26] hover:text-[#F5F5F5]"
                onClick={() => setIsLoginOpen(true)}
              >
                <IconUser />
                Entrar
              </Button>
            )}
            <Button
              asChild
              variant="ghost"
              className="relative h-10 border border-[#2a2a2a] bg-[#1a1a1a] text-[#F5F5F5] hover:bg-[#6B3E26] hover:text-[#F5F5F5]"
            >
              <Link to="/carrinho">
                <IconCart />
                Carrinho
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#6B3E26] text-[10px] font-semibold text-[#F5F5F5]">
                  {cartCount}
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
        <section className="grid gap-8 rounded-3xl border border-[#2a2a2a] bg-gradient-to-br from-[#161616] via-[#121212] to-[#1f1a17] p-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#D8CFC4]">
              Coleção Outono
            </p>
            <h1 className="font-['Playfair_Display'] text-4xl leading-tight md:text-5xl">
              Botas masculinas com presença e acabamento artesanal.
            </h1>
            <p className="max-w-xl text-sm text-[#D8CFC4]/80 md:text-base">
              Materiais selecionados, conforto imediato e design feito para durar
              muitos invernos.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button className="bg-[#6B3E26] text-[#F5F5F5] hover:bg-[#7b4a30]">
                Ver coleção completa
              </Button>
              <Button
                variant="outline"
                className="border-[#6B3E26] text-[#F5F5F5] hover:bg-[#6B3E26] hover:text-[#F5F5F5]"
              >
                Guia de tamanhos
              </Button>
            </div>
          </div>
          <div className="space-y-5 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D8CFC4]">
              Diferenciais
            </p>
            <div className="space-y-4 text-sm text-[#D8CFC4]/90">
              <div>
                <p className="font-semibold text-[#F5F5F5]">
                  Couro de flor integral
                </p>
                <p>Textura natural, envelhece com personalidade.</p>
              </div>
              <div>
                <p className="font-semibold text-[#F5F5F5]">Conforto imediato</p>
                <p>Forro macio e palmilha anatômica.</p>
              </div>
              <div>
                <p className="font-semibold text-[#F5F5F5]">
                  Acabamento feito à mão
                </p>
                <p>Costuras reforçadas e controle de qualidade rígido.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D8CFC4]">
              Destaques
            </p>
            <h2 className="font-['Playfair_Display'] text-3xl">
              Botas com estilo e resistência.
            </h2>
            <p className="text-sm text-[#D8CFC4]/80">
              Escolha a silhueta ideal para o seu guarda-roupa.
            </p>
          </div>

          {!loading && products.length === 0 ? (
            <Alert className="border-[#2a2a2a] bg-[#1a1a1a] text-[#F5F5F5]">
              <AlertTitle className="text-[#F5F5F5]">
                Nenhum produto encontrado
              </AlertTitle>
              <AlertDescription className="text-[#D8CFC4]/80">
                {loadError
                  ? "Não foi possível carregar os produtos agora. Tente novamente em instantes."
                  : "Não há produtos cadastrados ainda."}
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Card
                    key={`skeleton-${index}`}
                    className="border-[#2a2a2a] bg-[#1a1a1a] text-[#F5F5F5]"
                  >
                    <CardHeader className="p-0">
                      <Skeleton className="h-48 w-full rounded-t-lg" />
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </CardContent>
                    <CardFooter className="gap-3 px-6 pb-6">
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))
              : products.map((product) => {
                  const isAdding = Boolean(addingProducts[product.id])
                  return (
                    <Card
                      key={product.id}
                      className="border-[#c3b8aa] bg-[#D8CFC4] text-[#121212] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                    >
                      <CardHeader className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={product.photos[0]}
                            alt={product.title}
                            className="h-48 w-full object-cover"
                          />
                          <span className="absolute left-4 top-4 rounded-full bg-[#121212] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#F5F5F5]">
                            novo
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 p-6">
                        <div className="space-y-2">
                          <CardTitle className="font-['Playfair_Display']">
                            {product.title}
                          </CardTitle>
                          <CardDescription className="text-xs uppercase tracking-[0.3em] text-[#6B3E26]">
                            {product.material ?? "Couro premium"}
                          </CardDescription>
                          <p className="text-sm text-[#121212]/70">
                            {product.sole ?? "Solado resistente"} ·{" "}
                            {product.color ?? "Marrom"}
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-semibold text-[#6B3E26]">
                            {product.price}
                          </p>
                          {product.installment ? (
                            <p className="text-xs text-[#121212]/70">
                              {product.installment}
                            </p>
                          ) : null}
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between gap-3 px-6 pb-6">
                        <Button
                          className={`w-full bg-[#6B3E26] text-[#F5F5F5] transition hover:bg-[#7b4a30] active:scale-[0.98] ${isAdding ? "animate-pulse" : ""}`}
                          onClick={() => handleAddToCart(product.id)}
                          disabled={isAdding}
                        >
                          {isAdding ? "Adicionando..." : "Adicionar ao carrinho"}
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="border-[#6B3E26] text-[#F5F5F5] hover:bg-[#6B3E26] hover:text-[#F5F5F5]"
                        >
                          <Link to={`/produto/${product.id}`}>Ver produto</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
          </div>
        </section>
      </main>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Entrar na sua conta</DialogTitle>
            <DialogDescription>
              Use seu email e senha para continuar.
            </DialogDescription>
          </DialogHeader>
          <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                placeholder="voce@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Senha</Label>
              <Input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                placeholder="Sua senha"
                required
              />
            </div>
            {loginError ? (
              <div className="rounded-lg border border-[#6B3E26] bg-[#1c1511] px-4 py-3 text-sm text-[#D8CFC4]">
                {loginError}
              </div>
            ) : null}
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="bg-[#6B3E26] text-[#F5F5F5] hover:bg-[#7b4a30]"
                disabled={loginLoading}
              >
                {loginLoading ? "Entrando..." : "Entrar"}
              </Button>
              <Link
                to="/cadastro"
                className="text-center text-sm text-[#D8CFC4]/80 underline-offset-4 hover:text-[#F5F5F5] hover:underline"
                onClick={() => setIsLoginOpen(false)}
              >
                Nao tem conta? Entao cadastre-se
              </Link>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
