import { privateAxios } from "./axiosInstance";
export const addCategory = async (formData) => {
  try {
    console.log("Form Data:", formData); // Debugging line to check formData
    const res = await privateAxios.post("/category/add-category", formData);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add category" };
  }
};
export const addSubCategory = async (formData) => {
  try {
    console.log(formData,"formData in sub category api");
    const res = await privateAxios.post("/category/sub-category", formData);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add sub-category" };
  }
};
export const getCategory = async () => {
  try {
    const res = await privateAxios.get("/category/get-category");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch categories" };
  }
};
export const getSubCategory = async () => {
  try {
    const res = await privateAxios.get("/category/get-sub-category");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch sub-categories" };
  }
};
