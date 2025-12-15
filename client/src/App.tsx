import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  const [menu, setMenu] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isSignedUp, setisSignedUp] = useState(false);

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
            <Profile isLoggedIn={isLoggedIn} setisLoggedIn={setisLoggedIn} />
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
        <Route path="/payments/add" element={<AddPayment />} />
        <Route path="/payments/history" element={<PaymentHistory />} />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
