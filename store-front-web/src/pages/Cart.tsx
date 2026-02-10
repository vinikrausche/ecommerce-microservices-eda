import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import Skeleton from "@/components/Skeleton"
import { placeholderImage } from "@/data/products"
import { fetchProductById, type ApiProduct } from "@/services/api"
import { resolveUserId } from "@/services/cart"
import { checkoutOrder, type PaymentMethod } from "@/services/orders"
import { clearStoredToken, getStoredToken } from "@/services/users"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

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

type CartItem = ApiProduct & { quantity: number }

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, count: cartCount, updateCart } = useCart()
  const { toast } = useToast()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX")
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(() =>
    getStoredToken()
  )
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  const quantities = useMemo(() => {
    const map = new Map<number, number>()
    cart.items.forEach((itemId) => {
      map.set(itemId, (map.get(itemId) ?? 0) + 1)
    })
    return map
  }, [cart.items])

  const uniqueIds = useMemo(
    () => Array.from(quantities.keys()),
    [quantities]
  )

  useEffect(() => {
    if (uniqueIds.length === 0) {
      setItems([])
      setLoadError(false)
      return
    }

    let isMounted = true
    setLoading(true)
    setLoadError(false)

    Promise.all(uniqueIds.map((id) => fetchProductById(id)))
      .then((products) => {
        if (!isMounted) return
        const mapped = products.map((product) => ({
          ...product,
          quantity: quantities.get(Number(product.id)) ?? 1,
        }))
        setItems(mapped)
      })
      .catch(() => {
        if (!isMounted) return
        setLoadError(true)
        setItems([])
      })
      .finally(() => {
        if (!isMounted) return
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [quantities, uniqueIds])

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

  const handleLogout = () => {
    clearStoredToken()
    setAuthToken(null)
    setIsUserMenuOpen(false)
  }

  const handleOpenLogin = () => {
    navigate("/", { state: { openLogin: true } })
  }

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.preco * item.quantity, 0),
    [items]
  )

  const handleCheckout = async () => {
    if (cartCount === 0 || loading || loadError || checkoutLoading) return

    setCheckoutLoading(true)
    try {
      const response = await checkoutOrder({
        userId: resolveUserId(),
        productIds: cart.items,
        amount: total,
        paymentMethod,
      })
      toast({
        title: "Pedido criado",
        description: `Pedido #${response.orderId} enviado para pagamento.`,
      })
      updateCart({ id: cart.id, items: [] })
    } catch {
      toast({
        variant: "destructive",
        title: "Erro no checkout",
        description: "Nao foi possivel finalizar a compra agora.",
      })
    } finally {
      setCheckoutLoading(false)
    }
  }

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
                onClick={handleOpenLogin}
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

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D8CFC4]">
            Carrinho
          </p>
          <h1 className="font-['Playfair_Display'] text-3xl">
            Seus produtos selecionados
          </h1>
          <p className="text-sm text-[#D8CFC4]/80">
            {cartCount === 0
              ? "Seu carrinho esta vazio."
              : `${cartCount} itens no carrinho.`}
          </p>
        </div>

        {cartCount === 0 ? (
          <div className="rounded-3xl border border-[#2a2a2a] bg-[#161616] p-8 text-center">
            <p className="text-sm text-[#D8CFC4]/80">
              Continue explorando a colecao e escolha seus favoritos.
            </p>
            <Button
              asChild
              className="mt-6 bg-[#6B3E26] text-[#F5F5F5] hover:bg-[#7b4a30]"
            >
              <Link to="/">Voltar para a loja</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={`cart-skeleton-${index}`}
                      className="h-28 w-full rounded-2xl border border-[#2a2a2a]"
                    />
                  ))}
                </div>
              ) : loadError ? (
                <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 text-sm text-[#D8CFC4]/80">
                  Nao foi possivel carregar os itens do carrinho agora.
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const photo = item.fotos?.length
                      ? normalizePhoto(item.fotos[0] ?? "")
                      : placeholderImage("BOTA")
                    return (
                      <div
                        key={`cart-item-${item.id}`}
                        className="flex flex-col gap-4 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 sm:flex-row"
                      >
                        <div className="h-24 w-24 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#121212]">
                          <img
                            src={photo}
                            alt={item.titulo}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-['Playfair_Display'] text-lg">
                                {item.titulo}
                              </p>
                              <p className="text-xs uppercase tracking-[0.3em] text-[#D8CFC4]/70">
                                Couro premium
                              </p>
                            </div>
                            <p className="text-sm text-[#D8CFC4]/70">
                              {item.quantity}x
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#D8CFC4]/80">
                              {formatPrice(item.preco)} cada
                            </span>
                            <span className="font-semibold">
                              {formatPrice(item.preco * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="h-fit rounded-3xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
              <h2 className="font-['Playfair_Display'] text-2xl">
                Resumo do pedido
              </h2>
              <div className="mt-6 space-y-3 text-sm text-[#D8CFC4]/80">
                <div className="flex items-center justify-between">
                  <span>Itens</span>
                  <span>{cartCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Entrega</span>
                  <span>A combinar</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold text-[#F5F5F5]">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D8CFC4]">
                  Pagamento
                </p>
                <div className="space-y-2 text-sm text-[#D8CFC4]/80">
                  {[
                    { value: "PIX", label: "PIX" },
                    { value: "CREDIT_CARD", label: "Cartao de credito" },
                    { value: "DEBIT_CARD", label: "Cartao de debito" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#121212] px-4 py-3 hover:border-[#6B3E26]"
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={() =>
                          setPaymentMethod(method.value as PaymentMethod)
                        }
                        className="accent-[#6B3E26]"
                      />
                      <span>{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button
                className="mt-6 w-full bg-[#6B3E26] text-[#F5F5F5] hover:bg-[#7b4a30]"
                onClick={handleCheckout}
                disabled={cartCount === 0 || loading || loadError || checkoutLoading}
              >
                {checkoutLoading ? "Finalizando..." : "Finalizar compra"}
              </Button>
              <Button
                asChild
                variant="outline"
                className="mt-3 w-full border-[#6B3E26] text-[#F5F5F5] hover:bg-[#6B3E26] hover:text-[#F5F5F5]"
              >
                <Link to="/">Continuar comprando</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
