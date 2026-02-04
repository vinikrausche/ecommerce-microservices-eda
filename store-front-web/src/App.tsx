import { Route, Routes } from "react-router-dom"
import HomePage from "@/pages/Home"
import ProductPage from "@/pages/Product"
import RegisterPage from "@/pages/Register"
import CartPage from "@/pages/Cart"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/produto/:id" element={<ProductPage />} />
        <Route path="/carrinho" element={<CartPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
