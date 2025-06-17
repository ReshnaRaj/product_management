import { privateAxios } from "./axiosInstance";
 
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

export const getProducts = async (page = 1, limit = 12) => {
  try {
    const res = await privateAxios.get(`/product/get-products?page=${page}&limit=${limit}`);
    
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch products" };
  }
};
export const addToWishlist = async (productId) => {
  try {
    const res = await privateAxios.post("/product/add-wishList", { productId });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add to wishlist" };
  }
}
export const getWishlist = async () => {
  try {
    const res = await privateAxios.get("/product/get-wishList");
    console.log("res",res)
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch wishlist" };
  }
}
export const removeFromWishlist = async (productId) => {
  try {
    const res = await privateAxios.post("/product/remove-wishList", { productId });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to remove from wishlist" };
  }
};