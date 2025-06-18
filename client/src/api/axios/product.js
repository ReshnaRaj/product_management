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

// api/product.js
export const getProducts = async ({
  page = 1,
  limit = 12,
  search = "",
  subCategoryId = "",
} = {}) => {
  const params = new URLSearchParams({
    page,
    limit,
    ...(search && { search }),
    ...(subCategoryId && { subCategoryId }),
  });

  const res = await privateAxios.get(`/product/get-products?${params}`);
  return res.data;
};

export const getSingleProduct = async (id) => {
  try {
    const res = await privateAxios.get(`/product/get-product/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch product" };
  }
};
export const updateProduct = async (id, formData) => {
  try {
    const response = await privateAxios.put(
      `/product/update-product/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Update error:", error.response?.data || error);
    throw error.response?.data || { message: "Failed to update product" };
  }
};
export const addToWishlist = async (productId) => {
  try {
    const res = await privateAxios.post("/product/add-wishList", { productId });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add to wishlist" };
  }
};
export const getWishlist = async () => {
  try {
    const res = await privateAxios.get("/product/get-wishList");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch wishlist" };
  }
};
export const removeFromWishlist = async (productId) => {
  try {
    const res = await privateAxios.post("/product/remove-wishList", {
      productId,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to remove from wishlist" };
  }
};
