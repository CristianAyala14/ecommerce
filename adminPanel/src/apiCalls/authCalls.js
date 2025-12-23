import { axiosCall } from "./axiosConfig";

// auth requests
export async function signUpReq(user) {
  try {
    const response = await axiosCall.post("/auth/signup", user);
    return {
      ok: true,
      status: response.status,
      payload: {
        user: response.data.payload,
        accessToken: response.data.accessToken,
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

export async function signInReq(user) {
  try {
    const response = await axiosCall.post("/auth/signin", user);
    return {
      ok: true,
      status: response.status,
      payload: {
        user: response.data.payload,
        accessToken: response.data.accessToken,
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

export async function logOutReq() {
  try {
    const response = await axiosCall.get("/auth/logout");
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

export async function refreshTokenReq() {
  try {
    const response = await axiosCall.get("/auth/refresh");
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


export async function forgotPasswordEmail(email) {
  try {
    const response = await axiosCall.post("/auth/forgot-password", {email});
    return {
      ok: true,
      status: response.status,
      message: response.data.message
    };
  } catch (error) {
    return {
      ok: false,
      status: error.status,
      message: error.message,
    };
  }
}

export async function resetPasswordReq(token, password) {
  try {
    const response = await axiosCall.post(
      `/auth/reset-password/${token}`,
      { password }
    );

    return {
      ok: true,
      status: response.status,
      message: response.data.message,
    };
  } catch (error) {
    return {
      ok: false,
      status: error.response?.status,
      message: error.response?.data?.message || "Error resetting password",
    };
  }
}

