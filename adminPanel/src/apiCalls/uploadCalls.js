import { axiosWithAuth } from "./axiosConfig";


export async function uploadProfileImgReq(formData) {
  try {
    const response = await axiosWithAuth.post("/upload-img", formData);
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
