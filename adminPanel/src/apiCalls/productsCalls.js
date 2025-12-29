import { axiosCall , axiosWithAuth } from "./axiosConfig";

/* =========================
   PRODUCTS ON OFFER
========================= */
export async function getProductsByOfferReq(searchQuery) {
  try {
    const response = await axiosCall.get(
      `/products/offers?${searchQuery}`
    );

    return {
      ok: true,
      status: response.status,
      payload: {
        products: response.data.payload.docs,
        hasNextPage: response.data.payload.hasNextPage,
        hasPrevPage: response.data.payload.hasPrevPage,
        totalPages: response.data.payload.totalPages,
        totalDocs: response.data.payload.totalDocs,
      },
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
   ALL PRODUCTS
========================= */
export async function getAllProductsReq(searchQuery) {
  try {
    const response = await axiosCall.get(
      `/products/getall?${searchQuery}`
    );

    return {
      ok: true,
      status: response.status,
      payload: {
        products: response.data.payload.docs,
        hasNextPage: response.data.payload.hasNextPage,
        hasPrevPage: response.data.payload.hasPrevPage,
        totalDocs: response.data.payload.totalDocs,
        totalPages: response.data.payload.totalPages,
        page: response.data.payload.page,
      },
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
   PRODUCT BY ID
========================= */
export async function getProductByIdReq(id) {
  try {
    const response = await axiosCall.get(`/products/${id}`);

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
   NEW PRODUCTS
========================= */
export async function getNewProductsReq() {
  try {
    const response = await axiosCall.get("/products/new");

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

//con autorizacion
export async function updateProductReq(id, updatedProduct) {
  try {
    const response = await axiosWithAuth.put(`/products/${id}`, updatedProduct);
    return { ok: true, status: response.status, payload: response.data.payload };
  } catch (error) {
    return { ok: false, status: error.response?.status || 500, message: error.response?.data?.message || error.message };
  }
}

export async function deleteProductReq(id) {
  try {
    const response = await axiosWithAuth.delete(`/products/${id}`);
    return { ok: true, status: response.status, payload: response.data.payload };
  } catch (error) {
    return { ok: false, status: error.response?.status || 500, message: error.response?.data?.message || error.message };
  }
}

export async function createProductReq(newProduct) {
  try {
    const response = await axiosWithAuth.post("/products", newProduct);
    return { ok: true, status: response.status, payload: response.data.payload };
  } catch (error) {
    return { ok: false, status: error.response?.status || 500, message: error.response?.data?.message || error.message };
  }
}