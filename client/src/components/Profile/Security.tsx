import axios from "axios";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  id: string;
  role: "admin" | "user";
};

const Security = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    id: "", // Store userId
  });

  // Function to get user ID from JWT / localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser((prev) => ({
          ...prev,
          id: parsed.id || prev.id,
          email: parsed.email || prev.email,
        }));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUser((prevUser) => ({
          ...prevUser,
          id: decoded.id, // Extract user ID from JWT
        }));
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const handleSave = async () => {
    if (!user.password) {
      alert("Please enter a new password");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || !user.id) {
      alert("Not authorized");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/users/${user.id}/password`,
        {
          password: user.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Password updated successfully!");
        setUser((prev) => ({ ...prev, password: "" }));
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user. Please try again.");
    }
  };

  const handleCancel = () => {
    setUser((prev) => ({
      ...prev,
      password: "",
    }));
  };

  return (
    <div className="flex flex-col items-center pt-6 sm:pt-8 w-full px-4 sm:px-36">
      <h2 className="text-center text-xl sm:text-3xl font-serif mb-3 sm:mb-12">
        CHANGE PASSWORD
      </h2>
      <div className="w-full">
        <label>Enter Email</label>
        <input
          placeholder={"Enter Email"}
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="w-full p-2 sm:p-2 my-2 sm:my-4 text-xs sm:text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="w-full">
        <label>Enter new password</label>
        <input
          value={user.password}
          placeholder={"Enter new password"}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          type="password"
          className="w-full p-2 sm:p-2 my-2 sm:my-4 text-xs sm:text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="w-full flex justify-around my-3">
        <button
          onClick={handleSave}
          className="py-1 px-2 sm:py-1 sm:px-5 mb-2 sm:mb-6 text-xs md:text-lg font-bold border border-1 border-primary-dark text-white rounded-md bg-primary-dark hover:bg-secondary-light hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="py-1 px-2 sm:py-1 sm:px-5 mb-2 sm:mb-6 text-xs md:text-lg font-bold border border-1 border-primary-dark text-white rounded-md bg-primary-dark hover:bg-secondary-light hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Security;
