import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Catalog from './pages/Catalog'
import MyProducts from './pages/MyProducts'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'
import Artisans from './pages/Artisans'
import ArtisanDetail from './pages/ArtisanDetail'
import Search from './pages/Search'
import Regions from './pages/Regions'
import Stories from './pages/Stories'
import About from './pages/About'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Orders from './pages/Orders'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/artisans" element={<Artisans />} />
          <Route path="/artisans/:id" element={<ArtisanDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App