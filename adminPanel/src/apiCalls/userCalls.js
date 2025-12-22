import { axiosWithAuth } from "./axiosConfig";


export async function getUserByIdReq(userId) {
  try {
    const response = await axiosWithAuth.get(`/user/${userId}`);
    return {
      ok: true,
      status: response.status,
      payload: response.data.payload
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}

export async function updateUserReq(updateData) {
  try {
    const response = await axiosWithAuth.put("/user/update", updateData);
    return {
      ok: true,
      status: response.status,
      payload: {
        user: response.data.payload,
        accessToken: response.data.accessToken
      }
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}


export async function deleteUserReq() {
  try {
    const response = await axiosWithAuth.delete("/user/delete");
    return {
      ok: true,
      status: response.status,
      payload: response.data.message
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}
