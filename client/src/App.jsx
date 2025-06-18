import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Toaster } from "@/components/ui/sonner";
import Signup from "./pages/Signup";
import ProtectedRoute from "./Route/ProtectedRoute.jsx";
import ProductDetails from "./components/ProductDetails";

function App() {
  return (
    <>
      <Toaster
        toastOptions={{
          className: "bg-green-100 text-green-700 border border-green-300",
        }}
        position="top-center"
      />
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
