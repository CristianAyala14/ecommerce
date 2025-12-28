import { BrowserRouter, Routes, Route } from "react-router-dom";
//contexts
import { AuthContextProvider } from './contexts/authContext';

import { useSelector } from "react-redux";

import ProtectedRoute from "./components/protectedRoute";

import Header from "./components/header/Header"
import LogIn from "./pages/logIn/LogIn"
import Dashboard from "./pages/dashboard/Dashboard"
import Products from "./pages/products/Products"
import ProductEditView from "./pages/productEditView/ProductEditView"
import Categories from "./pages/categories/Categories"
import CategoryDetail from "./pages/categoryDetail/CategoryDetail"
import Orders from "./pages/orders/Orders"
import OrderDetail from "./pages/orderDetail/OrderDetail"
import Profile from "./pages/profile/Profile"
import "./App.css"
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";

function App() {

  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <div className="app-layout">

          {isAuthenticated && <Header />}
          
          <main className="app-content">
            <Routes>
              {/* LOGIN */}
              <Route path="/" element={<LogIn />} />
              {/* FORGOT PASSWORD? */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {/* RESET PASSWORD? */}
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* PROTECTED ROUTES */}
              <Route element={<ProtectedRoute />}> 
                {/* DASHBOARD */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* PRODUCTS */}
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductEditView />} />

                {/* CATEGORIES */}
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:id" element={<CategoryDetail />} />

                {/* ORDERS */}
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />

                {/* PROFILE */}
                <Route path="/profile" element={<Profile />} />
              </Route>
              
            </Routes>
          </main>        
        </div>
      </AuthContextProvider>
      
      
    </BrowserRouter>
  );
}

export default App;
