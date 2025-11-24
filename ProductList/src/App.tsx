import { Routes, Route } from 'react-router-dom'
import ProductListPage from './pages/ProductList/ProductList'
import ProductDetailPage from './pages/ProductDetail/ProductDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductListPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
    </Routes>
  )
}

export default App
