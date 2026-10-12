import axios from "axios";

const productsApi = axios.create({
  baseURL: "localhost:3000/api",
});

export { productsApi };
