import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

interface LoginProps {
  isLoggedIn: boolean;
  setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isSignedUp?: boolean;
}

const Login: React.FC<LoginProps> = ({ setisLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Both email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      // ✅ SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // ✅ SAVE USER OBJECT
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ SET LOGIN STATE
      setisLoggedIn(true);

      toast.success("Login successful");

      // ✅ ADMIN / USER ROUTING
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-96 px-6 py-8 bg-purple-50 rounded-lg shadow-md"
      >
        <h3 className="text-2xl font-medium mb-6 text-center">Login</h3>

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-purple-600 text-white rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default Login;
