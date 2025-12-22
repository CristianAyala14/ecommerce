import { axiosCall } from "./axiosConfig";

/* =========================
   ADD ITEM TO ORDER
========================= */
export async function addToOrderReq({ productId, quantity }) {
  try {
    const response = await axiosCall.post("/orders", {
      productId,
      quantity,
    });

    return {
      ok: true,
      status: response.status,
      payload: response.data.payload,
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}

/* =========================
   UPDATE ITEM QUANTITY
========================= */
export async function updateOrderItemQuantity({ productId, quantity }) {
  try {
    const response = await axiosCall.put("/orders/quantity", {
      productId,
      quantity,
    });

    return {
      ok: true,
      status: response.status,
      payload: response.data.payload,
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}

/* =========================
   GET CURRENT ORDER
========================= */
export async function getCurrentOrder() {
  try {
    const response = await axiosCall.get("/orders/current");

    return {
      ok: true,
      status: response.status,
      payload: response.data.payload,
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}

/* =========================
   REMOVE ITEM FROM ORDER
========================= */
export async function removeItemFromOrder(productId) {
  try {
    const response = await axiosCall.delete(`/orders/item/${productId}`);

    return {
      ok: true,
      status: response.status,
      payload: response.data.payload,
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}

/* =========================
   CLEAR ORDER
========================= */
export async function clearOrder() {
  try {
    const response = await axiosCall.delete("/orders/clear");

    return {
      ok: true,
      status: response.status,
      payload: response.data.payload,
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}
