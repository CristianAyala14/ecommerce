import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentOrder,
  addToOrderReq,
  updateOrderItemQuantity,
  removeItemFromOrder,
} from "../apiCalls/ordersCalls";

const OrderContext = createContext();

export function OrderProvider({ children }) {

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     GET CURRENT ORDER
  ========================= */
  const refreshOrder = async () => {
    const res = await getCurrentOrder();

    if (res.ok) {
      setOrder(res.payload);
    } else {
      console.log( res.status, res.message);
    }

    return res;
  };

  useEffect(() => {
    refreshOrder().finally(() => setLoading(false));
  }, []);

  /* =========================
     ADD ITEM
  ========================= */
  const addItem = async (productId, quantity) => {
    const res = await addToOrderReq({ productId, quantity });

    if (res.ok) {
      setOrder(res.payload);
    } else {
      console.log(res.status, res.message);
    }

    return res;
  };

  /* =========================
     UPDATE QUANTITY
  ========================= */
  const updateQuantity = async (productId, quantity) => {
    const res = await updateOrderItemQuantity({ productId, quantity });

    if (res.ok) {
      setOrder(res.payload);
    } else {
      console.log(
        res.status,
        res.message
      );
    }

    return res;
  };

  /* =========================
     REMOVE ITEM
  ========================= */
  const removeItem = async (productId) => {
    const res = await removeItemFromOrder(productId);

    if (res.ok) {
      setOrder(res.payload);
    } else {
      console.log(
        res.status,
        res.message
      );
    }

    return res;
  };



  /* =========================
     TOTAL ITEMS COUNT
  ========================= */
  const orderCount = order
    ? order.items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  return (
    <OrderContext.Provider
      value={{
        order,
        loading,
        orderCount,
        refreshOrder,
        addItem,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrderContext = ()=>{
    const context = useContext(OrderContext)
    if(!context){
        throw new Error("useAuthContext must be used within a provider")
    }
    return context;
}