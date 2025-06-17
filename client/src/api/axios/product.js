import { privateAxios } from "./axiosInstance";
// api/productApi.js
export const addProduct = async (formData) => {
  try {
    const res = await privateAxios.post("/product/add-product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add product" };
  }
};

export const getProducts = async () => {
  try {
    const res = await privateAxios.get("/product/get-products");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch products" };
  }
};