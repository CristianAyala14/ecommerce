import { useState } from "react";
import "./Order.css";
import OrderCard from "../../components/orderCard/OrderCard";
import { useOrderContext } from "../../contexts/orderContext";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const [shippingType, setShippingType] = useState(null);
  const [shippingWindow, setShippingWindow] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [calculatedCost, setCalculatedCost] = useState(null);

  const [shippingForm, setShippingForm] = useState({
    province: "",
    city: "",
    street: "",
    number: "",
    shippingType: shippingType,
    shippingType: shippingCost
  });

  const navigate = useNavigate();
  const { order, loading, updateQuantity, removeItem } = useOrderContext();

  if (loading) return <p className="loading-order-p">Cargando...</p>;
  if (!order) return <p className="no-order-p">Tu carrito está vacío.</p>;

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.quantity * item.productId.regularPrice,
    0
  );

  const total = subtotal + shippingCost;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateShipping = () => {
    const { province, city, street, number } = shippingForm;
    if (!province || !city || !street || !number) {
      alert("Debe completar el formulario de envio para continuar.");
      return;
    }
    setCalculatedCost(18000);
  };

  const acceptShipping = () => {
    setShippingCost(calculatedCost);
    setShippingWindow(false);
  };

  const choosePickup = () => {
    setShippingType("pickup");
    setShippingCost(0);
    setCalculatedCost(null);
    setShippingWindow(false);
  };

  const handlePay = () => console.log("pasarela de pago");

  return (
    <div className="order-container">
      <div className="order-content">
        <div className="order-cards">
          {order.items.map((item) => (
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
          ))}
        </div>

        <div className="order-details">
          <div className="order-details-lines-container">
            <div>
              <div className="order-line-subtotal">
                <p className="order-line-title">Subtotal:</p>
                <p>${subtotal.toLocaleString("es-AR")}</p>
              </div>

              <div className="order-line-subtotal">
                <p className="order-line-title">Envío:</p>
                <p>
                  {shippingCost
                    ? `$${shippingCost.toLocaleString("es-AR")}`
                    : "—"}
                </p>
              </div>
            </div>

            <div className="order-line-total">
              <p className="order-line-title">Total:</p>
              <p>${total.toLocaleString("es-AR")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pay-shipping-container">
        <div className="shipping-options">
          <label>
            <input
              type="radio"
              checked={shippingType === "pickup"}
              onChange={choosePickup}
            />
            Retiro en sucursal
          </label>

          <label>
            <input
              type="radio"
              checked={shippingType === "delivery"}
              onChange={() => setShippingType("delivery")}
            />
            Solicitar envío
          </label>

          {shippingType === "delivery" && (
            <button
              className="shipping-button"
              onClick={() => setShippingWindow(true)}
            >
              Gestionar envío
            </button>
          )}
        </div>

        <button
          className="pay-button"
          onClick={handlePay}
          disabled={!shippingType}
        >
          Ir a pagar
        </button>
      </div>

      {shippingWindow && (
        <div className="modal-overlay">
          <div className="shipping-modal">
            <h3>Dirección de envío</h3>
            <div className="shipping-modal-parts">
              
              <div className="shipping-modal-1">
              
              <input name="province" placeholder="Provincia" onChange={handleFormChange} />
              <input name="city" placeholder="Ciudad" onChange={handleFormChange} />
              <input name="street" placeholder="Calle" onChange={handleFormChange} />
              <input name="number" placeholder="Número" onChange={handleFormChange} />
              
              <button className="calculate-btn" onClick={calculateShipping}>
                Calcular envío
              </button>
              </div >        
            
              <div className="shipping-modal-2">
                <p className="calculated-cost">
                    Costo calculado:{" "}
                    <strong>${calculatedCost? calculatedCost.toLocaleString("es-AR") : 0}</strong>
                  </p>

                {calculatedCost && (
                  <div className="modal-buttons">
                    <button className="btn-retirar" onClick={choosePickup}>
                      Retirar
                    </button>

                    <button className="btn-aceptar" onClick={acceptShipping}>
                      Aceptar
                    </button>
                  </div>
                )}
              </div>

            </div>
            
            
          </div>
        </div>
      )}
    </div>
  );
}
