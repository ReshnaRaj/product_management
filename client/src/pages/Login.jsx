import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { loginUser } from "@/api/axios/auth";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await loginUser(formData);
     
      const userData = {
        user: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
        },
        token: response.token,
      };
      dispatch(setCredentials(userData));
      if (response.status === 200) {
     
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      {/* Card */}
      <div className="w-full max-w-5xl h-[90vh] md:h-[80vh] flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-xl bg-white">
        {/* LEFT – LOGIN FORM */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 sm:px-12">
          <h2 className="text-3xl font-bold text-[#d89e00] mb-8 leading-tight text-center">
            Sign In to
            <br />
            Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="pl-10 bg-gray-100/80 focus:bg-white"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="pl-10 bg-gray-100/80 focus:bg-white"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="text-right text-xs">
              <span className="cursor-pointer text-gray-600 hover:underline">
                forgot password?
              </span>
            </div>

            <Button
              className="w-full bg-[#d89e00] hover:bg-[#c58900]"
              type="submit"
            >
              SIGN IN
            </Button>
          </form>
        </div>

        {/* RIGHT – WELCOME PANEL */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-[#003b5c] text-white relative">
          {/* Decorative shapes */}
          <div className="absolute -right-10 -top-12 w-32 h-32 rotate-45 bg-white/10" />
          <div className="absolute left-1/2 top-1/4 w-8 h-8 rounded-full bg-white/10" />
          <div className="absolute right-8 bottom-1/3 w-4 h-4 rotate-45 bg-white/10" />
          <div className="absolute left-4 bottom-6 w-2 h-2 rounded-full bg-white/10" />

          {/* Content */}
          <h2 className="text-3xl font-semibold mb-3 text-center">
            Hello Friend!
          </h2>
          <p className="text-center text-sm mb-8 max-w-[240px] leading-relaxed">
            Enter your personal details and
            <br />
            start your journey with us
          </p>
          <Button
            // variant="outline"
            className="border-white text-white hover:bg-white/10"
            onClick={() => navigate("/signup")}
          >
            SIGN UP
          </Button>
        </div>
      </div>
    </div>
  );
}
