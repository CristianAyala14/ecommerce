import { useState, useEffect } from "react";
import "./Order.css";
import OrderCard from "../../components/orderCard/OrderCard";
import { useOrderContext } from "../../contexts/orderContext";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const { order, loading, updateQuantity, removeItem, updateShipping, updateBuyer } = useOrderContext();
  const [shippingWindow, setShippingWindow] = useState(false);
  const [calculatedCost, setCalculatedCost] = useState(null);
  const [buyerWindow, setBuyerWindow] = useState(false);
  const [shippingForm, setShippingForm] = useState({
    province: "",
    city: "",
    street: "",
    number: "",
  });
  const [buyerForm, setBuyerForm] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
  });

  

 
  /* =========================
     🔁 PRECARGAR FORMS AL ABRIR MODAL
  ========================= */
  
  useEffect(() => {
    if (!shippingWindow) return;

    if (order.shipping?.address) {
      setShippingForm({
        province: order.shipping.address.province || "",
        city: order.shipping.address.city || "",
        street: order.shipping.address.street || "",
        number: order.shipping.address.number || "",
      });

      setCalculatedCost(order.shipping.cost || null);
    } else {
      setShippingForm({
        province: "",
        city: "",
        street: "",
        number: "",
      });

      setCalculatedCost(null);
    }
  }, [shippingWindow, order?.shipping]);

  useEffect(() => {
    if (!buyerWindow) return;

    if (order.buyer) {
      setBuyerForm({
        name: order.buyer.name || "",
        lastname: order.buyer.lastname || "",
        email: order.buyer.email || "",
        phone: order.buyer.phone || "",
      });

    } else {
      setBuyerForm({
        name: "",
        lastname: "",
        email: "",
        phone: "",
      });
    }
  }, [buyerWindow, order?.buyer]);


  //handles change para los forms
  const handleShippingFormChange = (e) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuyerFormChange = (e) => {
    const { name, value } = e.target;
    setBuyerForm((prev) => ({ ...prev, [name]: value }));
  };

  //pending
  const calculateShipping = () => {
    const { province, city, street, number } = shippingForm;
    if (!province || !city || !street || !number) {
      alert("Debe completar el formulario de envio para continuar.");
      return;
    }
    setCalculatedCost(18000);
  };

  /* =========================
     DELIVERY
  ========================= */
  const acceptShipping = async () => {
    const res = await updateShipping("delivery", calculatedCost, shippingForm);

    if (res.ok) {
      setShippingWindow(false);
    } else {
      alert(res.message);
    }
  };

  /* =========================
     PICKUP
  ========================= */
  const choosePickup = async () => {
    const res = await updateShipping("pickup", 0, null);

    if (res.ok) {
      setCalculatedCost(null);
      setShippingWindow(false);
    } else {
      alert(res.message);
    }
  };

   /* =========================
     BUYER
  ========================= */
  const saveBuyer = async () =>{
    const {name, lastname, email, phone} = buyerForm;
    if(!name || !lastname || !email || !phone){
      alert("Debe completar el formulario de comprador para continuar.")
      return
    } 
    
    const res = await updateBuyer(buyerForm)
    if (res.ok) {
      setBuyerWindow(false);
    } else {
      alert(res.message);
    }
  }


  const handlePay = () => console.log("pasarela de pago");


  if (loading) return <p className="loading-order-p">Cargando...</p>;
  if (!order) return <p className="no-order-p">Tu carrito está vacío.</p>;

    /* =========================
     SOURCE OF TRUTH
  ========================= */
  const shippingType = order.shipping?.type || null;
  const shippingCost = order.shipping?.cost || 0;

   const subtotal = order.items.reduce(
    (acc, item) => acc + item.quantity * item.productId.regularPrice,
    0
  );

  const total = subtotal + shippingCost;

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
              onChange={() => setShippingWindow(true)}
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
          <button
              className="buyer-button"
              onClick={() => setBuyerWindow(true)}
            >
              Datos de comprador
          </button>
        </div>

        <button
          className="pay-button"
          onClick={handlePay}
          disabled={!order.shipping?.type || !order.buyer}
        >
          Pagar
        </button>
      </div>

      {shippingWindow && (
        <div className="modal-overlay">
          <div className="shipping-modal">
            <h3>Dirección de envío</h3>
            <div className="shipping-modal-parts">
              <div className="shipping-modal-1">
                <input
                  name="province"
                  placeholder="Provincia"
                  value={shippingForm.province}
                  onChange={handleShippingFormChange}
                />
                <input
                  name="city"
                  placeholder="Ciudad"
                  value={shippingForm.city}
                  onChange={handleShippingFormChange}
                />
                <input
                  name="street"
                  placeholder="Calle"
                  value={shippingForm.street}
                  onChange={handleShippingFormChange}
                />
                <input
                  name="number"
                  placeholder="Número"
                  value={shippingForm.number}
                  onChange={handleShippingFormChange}
                />

                <button className="calculate-btn" onClick={calculateShipping}>
                  Calcular envío
                </button>
              </div>

              <div className="shipping-modal-2">
                <p className="calculated-cost">
                  Costo calculado:{" "}
                  <strong>
                    ${calculatedCost ? calculatedCost.toLocaleString("es-AR") : 0}
                  </strong>
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

      {buyerWindow && (
        <div className="modal-buyer-overlay">
          <div className="buyer-modal">
            <h3>Datos de comprador </h3>
            <div className="buyer-modal-form">
              <input
                name="name"
                placeholder="Nombre"
                value={buyerForm.name}
                onChange={handleBuyerFormChange}
              />
              <input
                name="lastname"
                placeholder="Apellido"
                value={buyerForm.lastname}
                onChange={handleBuyerFormChange}
              />
              <input
                name="email"
                placeholder="E-mail"
                value={buyerForm.email}
                onChange={handleBuyerFormChange}
              />
              <input
                name="phone"
                placeholder="Celular"
                value={buyerForm.phone}
                onChange={handleBuyerFormChange}
              />

              <button className="buyer-form-btn" onClick={saveBuyer}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
