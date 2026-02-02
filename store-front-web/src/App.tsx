import { Route, Routes } from "react-router-dom"
import HomePage from "@/pages/Home"
import ProductPage from "@/pages/Product"
import RegisterPage from "@/pages/Register"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/produto/:id" element={<ProductPage />} />
    </Routes>
  )
}

export default App
