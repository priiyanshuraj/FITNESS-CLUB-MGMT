import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  id: string;
  role: "admin" | "user";
};

const EditProfile = ({ setProfileId }) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    fullName: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const id = decoded.id;
      setUserId(id);

      // ✅ Fetch existing profile using JWT-authenticated route
      axios
        .get(`http://localhost:5000/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const { profile } = res.data;
          if (profile) {
            setFormData((prev) => ({
              ...prev,
              dob: profile.dob ? profile.dob.substring(0, 10) : "",
              address: profile.address || "",
              city: profile.city || "",
              state: profile.state || "",
              country: profile.country || "",
              pincode: profile.pincode ? String(profile.pincode) : "",
            }));
          }
        })
        .catch((err) => {
          console.error("Failed to load profile", err);
        });
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token || !userId) return;

    await axios.put(
      `http://localhost:5000/api/profile/${userId}`,
      {
        dob: formData.dob,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode ? Number(formData.pincode) : undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Profile updated");
    setProfileId(0);
  };

  const handleCancel = () => {
    setProfileId(0);
  };


  return (
    <form
      onSubmit={handleSave}
      className="flex flex-col items-center pt-6 sm:pt-8 w-full px-4 sm:px-36"
    >
      <h2 className="text-center text-xl sm:text-3xl font-serif mb-3 sm:mb-12">
        EDIT PROFILE
      </h2>

      <div className="w-full">
        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full p-2 my-2 text-xs sm:text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="w-full">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 my-2 text-xs sm:text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex gap-2 w-full">
        <div className="w-full">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-2 my-2 text-xs sm:text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="w-full">
          <label>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full p-2 my-2 text-xs sm:text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="w-full">
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full p-2 my-2 text-xs sm:text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="w-full">
        <label>Pincode</label>
        <input
          type="number"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          className="w-full p-2 my-2 text-xs sm:text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="w-full flex justify-around my-3">
        <button
          type="submit"
          className="py-1 px-2 sm:px-5 mb-2 text-xs md:text-lg font-bold border border-1 border-primary-dark text-white rounded-md bg-primary-dark hover:bg-secondary-light hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="py-1 px-2 sm:px-5 mb-2 text-xs md:text-lg font-bold border border-1 border-primary-dark text-white rounded-md bg-primary-dark hover:bg-secondary-light hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
