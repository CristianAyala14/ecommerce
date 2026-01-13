import { axiosCall, axiosWithAuth } from "./axiosConfig";

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

export async function createCategoryReq(newCategory) {
  try {
    const response = await axiosWithAuth.post("/categories/create", newCategory);

    return {
      ok: true,
      status: response.status,
      payload: response.data.payload, // new category
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}

export async function updateCategoryReq(id, updatedCategory) {
  try {
    const response = await axiosWithAuth.put(`/categories/${id}`, updatedCategory);

    return {
      ok: true,
      status: response.status,
      payload: response.data.payload, // updated category
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}

export async function deleteCategoryReq(id) {
  try {
    const response = await axiosWithAuth.delete(`/categories/${id}`);

    return {
      ok: true,
      status: response.status,
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}



  