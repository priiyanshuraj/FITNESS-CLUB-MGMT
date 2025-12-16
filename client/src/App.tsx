import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./pages/AuthPages/Login";
import Profile from "./pages/Profile";
import Chats from "./pages/Chats";

import Shopping from "./pages/Shopping";
import Blogs from "./pages/Blogs";
import CreateBlog from "./components/Blog/CreateBlog";
import Signup from "./pages/AuthPages/Signup";
import SingleBlog from "./pages/SingleBlog";
import CartElement from "./pages/CartElement";
import Workouts from "./pages/Workouts";
import Diets from "./pages/Diets";
import Chatpage from "./components/Chat/Chatpage";
// import { useState } from "react";
import Chatlayout from "./components/Chat/Chatlayout";
import Doctorlist from "./components/Chat/Doctorlist";
import ProductIndividualCard from "./components/shopping/ProductShop/ProductIndividualCard";
import Cart from "./components/shopping/Cart/cart";
import CreateOrder from "./components/shopping/Cart/CreateOrder";
import Orders from "./components/shopping/Cart/Orders";
import AddPayment from "./pages/Payments/AddPayment";
import PaymentHistory from "./pages/Payments/PaymentHistory";
import AdminDashboard from "./pages/AdminDashboard";

// ✅ Simple auth guard using JWT in localStorage
const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ✅ Admin-only guard using stored user role
const RequireAdmin: React.FC<{ children: JSX.Element }> = ({ children }) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!token || !user || user.role !== "admin") {
      return <Navigate to="/" replace />;
    }
    return children;
  } catch {
    return <Navigate to="/" replace />;
  }
};

function App() {
  const [menu, setMenu] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isSignedUp, setisSignedUp] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setisLoggedIn(true);
  }, []);


  return (
    <Router>
      <Navbar setMenu={setMenu} menu={menu} isLoggedIn={isLoggedIn} />
      {menu && <Sidebar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <Login
              isLoggedIn={isLoggedIn}
              setisLoggedIn={setisLoggedIn}
              isSignedUp={isSignedUp}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup isSignedUp={isSignedUp} setisSignedUp={setisSignedUp} />
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile isLoggedIn={isLoggedIn} setisLoggedIn={setisLoggedIn} />
            </RequireAuth>
          }
        />
        <Route path="/chats" element={<Chats userId="someUserId" />} />
        <Route path="/chats/message" element={<Chatlayout />} />
        <Route path="/chats/individualmessage" element={<Chatpage />} />
        <Route path="/chats/appoinment" element={<Doctorlist />} />
        <Route
          path="/shopping"
          element={
            <Shopping setMenu={setMenu} menu={menu} isLoggedIn={isLoggedIn} />
          }
        />
        <Route
          path="/shopping/cart"
          element={<CartElement setMenu={setMenu} menu={menu} />}
        />
        <Route path="/shopping/:id" element={<ProductIndividualCard />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/diets" element={<Diets />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<SingleBlog />} />
        <Route path="/blogs/createblog" element={<CreateBlog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders/create" element={<CreateOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route
          path="/payments/add"
          element={
            <RequireAdmin>
              <AddPayment />
            </RequireAdmin>
          }
        />
        <Route
          path="/payments/history"
          element={
            <RequireAdmin>
              <PaymentHistory />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
