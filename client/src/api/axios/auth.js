
import { publicAxios, privateAxios } from '../axios/axiosInstance';
// Public routes - use publicAxios
export const loginUser = async (formData) => {
  try {
    const res = await publicAxios.post('/auth/login', formData);
    console.log(res,"status checking")
    return {
      user: {
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email
      },
      token: res.data.token,
      status: res.status
    };
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const signupUser = async (formData) => {
    try {
        const res = await publicAxios.post('/auth/signup', formData);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Signup failed" };
    }
};

// Protected route example - use privateAxios
export const getUserProfile = async () => {
    try {
        const res = await privateAxios.get('/auth/profile');
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch profile" };
    }
};