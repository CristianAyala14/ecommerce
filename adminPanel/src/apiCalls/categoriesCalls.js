import { axiosCall } from "./axiosConfig";

/* =========================
   ALL CATEGORIES
========================= */
export async function getAllCategoriesReq() {
  try {
    const response = await axiosCall.get("/categories");

    return {
      ok: true,
      status: response.status,
      payload: response.data.payload, // array de categorías
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}
