import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header/Header"
import Home from "./pages/home/Home"
import Products from "./pages/products/Products"
import About from "./pages/about/About"
import Contact from "./pages/contact/Contact"
import Order from "./pages/order/Order"
import Footer from "./components/footer/Footer"
import Profile from "./pages/profile/Profile"
import Product from "./components/product/Product"
import ScrollToTop from "./components/scrollToTop/scrollToTop";


function App() {

  return (
    <main>
      <BrowserRouter>
        <ScrollToTop />
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/products" element={<Products/>}/>
          <Route path="/products/:productId" element={<Product/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/order" element={<Order/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </main>
  )
}

export default App
