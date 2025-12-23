import { BrowserRouter, Routes, Route } from "react-router-dom";
//contexts
import { AuthContextProvider } from './contexts/authContext';

import Header from "./components/header/Header"
import LogIn from "./pages/logIn/LogIn"
import Dashboard from "./pages/dashboard/Dashboard"
import Products from "./pages/products/Products"
import ProductDetail from "./pages/productDetail/ProductDetail"
import Categories from "./pages/categories/Categories"
import CategoryDetail from "./pages/categoryDetail/CategoryDetail"
import Orders from "./pages/orders/Orders"
import OrderDetail from "./pages/orderDetail/OrderDetail"
import Profile from "./pages/profile/Profile"
import "./App.css"
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <div className="app-layout">
          <Header/>
          <main className="app-content">
            <Routes>
              {/* LOGIN */}
              <Route path="/" element={<LogIn />} />

              {/* DASHBOARD */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* PRODUCTS */}
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* CATEGORIES */}
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:id" element={<CategoryDetail />} />

              {/* ORDERS */}
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />

              {/* PROFILE */}
              <Route path="/profile" element={<Profile />} />

              {/* FORGOT PASSWORD? */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {/* FORGOT PASSWORD? */}
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
          </main>        
        </div>
      </AuthContextProvider>
      
      
    </BrowserRouter>
  );
}

export default App;
