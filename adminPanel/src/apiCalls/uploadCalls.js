import { axiosWithAuth } from "./axiosConfig";


export async function uploadProfileImgReq(formData) {
  try {
    const response = await axiosWithAuth.post("/upload-img/profile", formData);
    return {
      ok: true,
      status: response.status,
      url: response.data.url
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}


export async function uploadProductImgReq(formData) {
  try {
    const response = await axiosWithAuth.post("/upload-img/product", formData);
    return {
      ok: true,
      status: response.status,
      url: response.data.url,
    };
  } catch (error) {
    return {
      ok: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
    };
  }
}


