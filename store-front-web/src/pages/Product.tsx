import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Skeleton from "@/components/Skeleton"
import { Button } from "@/components/ui/button"
import { placeholderImage } from "@/data/products"
import { fetchProductById, type ApiProduct } from "@/services/api"
import { clearStoredToken, getStoredToken } from "@/services/users"

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

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ApiProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(() =>
    getStoredToken()
  )
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!id) return
    let isMounted = true
    setLoading(true)
    setLoadError(false)
    setProduct(null)
    fetchProductById(id)
      .then((item) => {
        if (!isMounted) return
        setProduct(item)
      })
      .catch(() => {
        if (!isMounted) return
        setLoadError(true)
      })
      .finally(() => {
        if (!isMounted) return
        setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [id])

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

  const photos =
    product?.fotos && product.fotos.length > 0
      ? product.fotos.map(normalizePhoto)
      : [placeholderImage("BOTA")]
  const thumbnails = photos.slice(1)

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
              variant="ghost"
              className="relative h-10 border border-[#2a2a2a] bg-[#1a1a1a] text-[#F5F5F5] hover:bg-[#6B3E26] hover:text-[#F5F5F5]"
            >
              <IconCart />
              Carrinho
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#6B3E26] text-[10px] font-semibold text-[#F5F5F5]">
                1
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1a1a1a]">
            {loading ? (
              <Skeleton className="h-[420px] w-full" />
            ) : (
              <img
                src={photos[0]}
                alt={product?.titulo ?? "Produto"}
                className="h-[420px] w-full object-cover"
              />
            )}
          </div>
          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={`thumb-${index}`}
                  className="h-32 w-full rounded-2xl border border-[#2a2a2a]"
                />
              ))}
            </div>
          ) : thumbnails.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {thumbnails.map((photo, index) => (
                <div
                  key={`${product?.id ?? "produto"}-${index}`}
                  className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a]"
                >
                  <img
                    src={photo}
                    alt={`${product?.titulo ?? "Produto"} - ${index + 2}`}
                    className="h-32 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#D8CFC4]">
              Produto
            </p>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : loadError ? (
              <p className="text-sm text-[#D8CFC4]/80">
                Nao foi possivel carregar este produto.
              </p>
            ) : (
              <>
                <h1 className="font-['Playfair_Display'] text-4xl">
                  {product?.titulo}
                </h1>
                <p className="text-sm text-[#D8CFC4]/80">
                  {product?.descricao}
                </p>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
            <div className="flex items-center justify-between">
              <div>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-semibold text-[#F5F5F5]">
                      {product ? formatPrice(product.preco) : "--"}
                    </p>
                    <p className="text-xs text-[#D8CFC4]/80">
                      {product ? `${product.quantidade} em estoque` : ""}
                    </p>
                  </>
                )}
              </div>
            </div>
            <Button
              className="mt-6 w-full bg-[#6B3E26] text-[#F5F5F5] hover:bg-[#7b4a30]"
              disabled={loading || loadError}
            >
              Comprar agora
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
