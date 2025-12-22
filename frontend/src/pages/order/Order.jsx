import { useEffect, useState } from "react";
import "./Order.css";
import OrderCard from "../../components/orderCard/OrderCard";
import { useOrder } from "../../contexts/orderContext";

export default function Order() {
  const {
    order,
    loading,        // 👈 ya estaba, ahora se usa
    updateQuantity,
    removeItem,
    clear,
  } = useOrder();

 

  // 🔧 FIX 1: esperar a que termine el fetch inicial
  if (loading) {
    return <p className="loading-order-p">Cargando...</p>;
  }

  // 🔧 FIX 2: order puede ser null (backend devuelve payload: null)
  if (!order) {
    return <p className="no-order-p">Tu carrito está vacío.</p>;
  }

   const totalQuantity = order.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.quantity * item.productId.regularPrice,
    0
  );

  return (
    <div className="order-container">
      <div className="order-content">

        <div className="order-cards">
          {order.items.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            order.items.map(item => (
              <OrderCard
                key={item.productId._id}
                id={item.productId._id}
                img={item.productId.images?.[0]}  
                title={item.productId.title}
                regularPrice={item.productId.regularPrice}
                quantity={item.quantity}
                removeItem={removeItem}
                clearOrder={clear}
                onUpdateQuantity={updateQuantity}
              />
            ))
          )}
        </div>

        <div className="order-details">
          {order.items.length === 0 ? (
            <p>No hay detalle disponible</p>
          ) : (
            <div className="order-details-lines-container">
              <div>
                <div className="order-line-subtotal">
                  <p className="order-line-title">Subtotal:</p>
                  <p>${subtotal.toLocaleString("es-AR")}</p>
                </div>
                <div className="order-line-subtotal">
                  <p className="order-line-title">Descuento:</p>
                  <p></p>
                </div>
                
              </div>
              <div>
                <div className="order-line-total">
                  <p className="order-line-title">Total:</p>
                  {/* por ahora pongo misma funcion que subtotal, por q no hay descuentos para aplicar. */}
                  <p>${subtotal.toLocaleString("es-AR")}</p>
                </div>
              </div>
            </div>

            
          )}
        </div>
      </div>

      <div className="pay-button-container">
        <button className="pay-button">
          Ir a pagar
        </button>
      </div>
    </div>
  );
}
