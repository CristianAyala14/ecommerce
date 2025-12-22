import axios from 'axios';
const base_url = `http://localhost:8080/api`


//call para sing in y sing up
export const axiosCall = axios.create({
    baseURL: base_url ,
    withCredentials: true,
})



axiosCall.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      status: error.response?.status || 0,
      message:
        error.response?.data?.message || "No server response",
    };

    return Promise.reject(customError);
  }
);

