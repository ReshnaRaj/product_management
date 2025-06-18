import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { signupUser } from "@/api/axios/auth";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>{
     const { name, value } = e.target;
     if(name==="password" && value.length < 6) {
        setError("Password must be at least 6 characters long");
        
      }
      else{
        setError("")
      }
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res=await signupUser(formData);
toast.success("Signup successful");
      if (res.status === 201) navigate("/login");
    } catch (err) {
      
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-5xl h-[90vh] md:h-[80vh] flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-xl bg-white">
        <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-[#003b5c] text-white relative">
          <div className="absolute -left-20 -bottom-10 w-72 h-72 rounded-full bg-white/10" />
          <div className="absolute right-14 top-6 w-8 h-8 rotate-45 bg-white/10" />
          <div className="absolute left-16 bottom-20 w-4 h-4 rotate-45 bg-white/10" />

          <h2 className="text-3xl font-semibold mb-2 text-center">
            Welcome Back!
          </h2>
          <p className="text-center text-sm mb-8 max-w-[220px] leading-relaxed">
            To keep connected with us please login with your personal info
          </p>
          <Button
            // variant="outline"
            // className="border-white text-white hover:bg-white/10"
            onClick={() => navigate("/login")}
          >
            SIGN IN
          </Button>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 sm:px-12">
          <h2 className="text-2xl font-bold text-[#d89e00] mb-8 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="pl-10 bg-gray-100/80 focus:bg-white"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
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

            <Button
              className="w-full bg-[#d89e00] hover:bg-[#c58900]"
              type="submit"
            >
              SIGN UP
            </Button>
          </form>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <span
              className="text-[#d89e00] font-medium cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
