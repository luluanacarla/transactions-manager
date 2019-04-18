import axios from "axios";

const API = () => {

  const axiosConf = {
    baseURL: "http://localhost:3000/api"
  };

  const axiosInstance = axios.create(axiosConf);

  axiosInstance.interceptors.response.use(
    response => response
  );

  return axiosInstance;
};

export default API;
