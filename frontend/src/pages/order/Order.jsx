import { useEffect, useState } from "react";
import "./Order.css";
import OrderCard from "../../components/orderCard/OrderCard";
import { useOrderContext } from "../../contexts/orderContext";
import { payOrderReq } from "../../apiCalls/ordersCalls";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const navigate = useNavigate();
  const {
    order,
    loading,
    updateQuantity,
    removeItem,
    refreshOrder,
  } = useOrderContext();

  // Esperar a que termine el fetch inicial
  if (loading) {
    return <p className="loading-order-p">Cargando...</p>;
  }

  // order puede ser null
  if (!order) {
    return <p className="no-order-p">Tu carrito está vacío.</p>;
  }

  const totalQuantity = order.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const subtotal = order.items.reduce(
    (acc, item) =>
      acc + item.quantity * item.productId.regularPrice,
    0
  );


  const handlePay = async () => {
    const res = await payOrderReq();

    if (res.ok) {
      alert("✅ Pago exitoso");

      await refreshOrder(); // 🔥 deja order en null
      navigate("/");
    } else {
      alert(res.message || "❌ Error al pagar");
    }
  };



  return (
    <div className="order-container">
      <div className="order-content">
        <div className="order-cards">
          {order.items.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            order.items.map((item) => (
              <OrderCard
                key={item.productId._id}
                id={item.productId._id}
                img={item.productId.images?.[0]?.url}
                title={item.productId.title}
                regularPrice={item.productId.regularPrice}
                quantity={item.quantity}
                removeItem={removeItem}
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
                  <p>${subtotal.toLocaleString("es-AR")}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pay-button-container">
        <button className="pay-button" onClick={handlePay}>
          Ir a pagar
        </button>
      </div>
    </div>
  );
}
