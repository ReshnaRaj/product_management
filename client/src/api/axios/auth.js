import { publicAxios, privateAxios } from "../axios/axiosInstance";

export const loginUser = async (formData) => {
  try {
    const res = await publicAxios.post("/auth/login", formData);

    return {
      user: {
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
      },
      token: res.data.token,
      status: res.status,
    };
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const signupUser = async (formData) => {
  try {
    const res = await publicAxios.post("/auth/signup", formData);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

export const getUserProfile = async () => {
  try {
    const res = await privateAxios.get("/auth/profile");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};
