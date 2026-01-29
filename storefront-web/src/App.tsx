import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-start justify-center gap-6 px-6 py-16">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Storefront UI
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Frontend pronto para o microserviço
          </h1>
          <p className="max-w-xl text-muted-foreground">
            React + TypeScript + Tailwind + shadcn/ui configurados.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Explorar catálogo</Button>
          <Button variant="outline">Ver pedidos</Button>
        </div>
      </div>
    </div>
  )
}

export default App
