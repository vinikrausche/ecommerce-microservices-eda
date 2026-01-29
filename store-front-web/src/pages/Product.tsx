import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Skeleton from "@/components/Skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockProducts, placeholderImage, type Product } from "@/data/products"
import { fetchProductById } from "@/services/api"

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)

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
  const [product, setProduct] = useState<Product>(mockProducts[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let isMounted = true
    fetchProductById(id)
      .then((item) => {
        if (!isMounted) return
        setProduct({
          id: String(item.id),
          title: item.titulo,
          price: formatPrice(item.preco),
          quantity: `${item.quantidade} unidades`,
          description: item.descricao,
          photos:
            item.fotos && item.fotos.length > 0
              ? item.fotos
              : [placeholderImage("BOTA")],
          highlights: ["Couro premium", "Conforto imediato", "Acabamento manual"],
          details: [
            { label: "Cor", value: "Marrom café" },
            { label: "Solado", value: "Emborrachado antiderrapante" },
            { label: "Estilo", value: "Masculino premium" },
          ],
        })
      })
      .catch(() => {
        if (!isMounted) return
        setProduct(mockProducts.find((item) => item.id === id) ?? mockProducts[0])
      })
      .finally(() => {
        if (!isMounted) return
        setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [id])

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
            <Button
              variant="ghost"
              className="h-10 border border-[#2a2a2a] bg-[#1a1a1a] text-[#F5F5F5] hover:bg-[#6B3E26] hover:text-[#F5F5F5]"
            >
              <IconUser />
              Entrar
            </Button>
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
                src={product.photos[0]}
                alt={product.title}
                className="h-[420px] w-full object-cover"
              />
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={`thumb-${index}`}
                    className="h-32 w-full rounded-2xl border border-[#2a2a2a]"
                  />
                ))
              : product.photos.map((photo, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a]"
                  >
                    <img
                      src={photo}
                      alt={`${product.title} - ${index + 1}`}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                ))}
          </div>
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
            ) : (
              <h1 className="font-['Playfair_Display'] text-4xl">
                {product.title}
              </h1>
            )}
            <p className="text-sm text-[#D8CFC4]/80">
              {loading ? "Carregando descrição..." : product.description}
            </p>
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
                      {product.price}
                    </p>
                    <p className="text-xs text-[#D8CFC4]/80">
                      {product.quantity} em estoque
                    </p>
                  </>
                )}
              </div>
              <span className="rounded-full bg-[#6B3E26] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#F5F5F5]">
                premium
              </span>
            </div>
            <Button
              className="mt-6 w-full bg-[#6B3E26] text-[#F5F5F5] hover:bg-[#7b4a30]"
              disabled={loading}
            >
              Comprar agora
            </Button>
          </div>

          <Card className="border-[#c3b8aa] bg-[#D8CFC4] text-[#121212]">
            <CardHeader>
              <CardTitle className="font-['Playfair_Display']">
                Destaques do produto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                  </div>
                </div>
              ) : (
                <>
                  <ul className="space-y-2">
                    {product.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#6B3E26]" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {product.details.map((detail) => (
                      <div
                        key={detail.label}
                        className="rounded-xl border border-[#b7aa9b] bg-[#F5F5F5] p-3"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-[#6B3E26]">
                          {detail.label}
                        </p>
                        <p className="text-sm font-semibold">
                          {detail.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
