import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { IoHome, IoLogIn } from "react-icons/io5";
import { FaCartShopping, FaMicroblog } from "react-icons/fa6";
import { SiGnuprivacyguard } from "react-icons/si";
import { CgProfile } from "react-icons/cg";
import { BsChatSquareDots } from "react-icons/bs";
import { RiContactsBook3Fill } from "react-icons/ri";
import { useMemo, useState } from "react";
import { MdPayments } from "react-icons/md";

const Sidebar = () => {
   const [openPayments, setOpenPayments] = useState(false);

   // ✅ Derive auth + role from localStorage (no prop drilling)
   const { isLoggedIn, isAdmin } = useMemo(() => {
      try {
         const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
         const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
         const user = storedUser ? JSON.parse(storedUser) : null;
         return {
            isLoggedIn: Boolean(token),
            isAdmin: user?.role === "admin",
         };
      } catch {
         return { isLoggedIn: false, isAdmin: false };
      }
   }, []);

   return (
      <div
         className={`${styles.sideBar} w-24 fixed overflow-hidden top-16 z-10 bottom-0 left-0	hover:w-40 hover:visible `}
      >
         <nav
            className={`${styles.nav} bg-primary-dark  w-full h-full p-4 rounded-r-lg shadow-lg transition-all duration-300`}
         >
            {/* <div className="mb-8  ">
          <h1 className="text-3xl font-semibold text-white">FitMaestro</h1>
        </div> */}
            <ul className="flex flex-col gap-4 text-white">
               <li>
                  <NavLink
                     to="/"
                     className={({ isActive }) => (isActive ? "font-bold" : "")}
                  >
                     <div
                        className={`${styles.sideHover} my-2 flex gap-3 items-center justify-center `}
                     >
                        <span
                           className={`${styles.sideIcon} text-2xl hover:text-xl`}
                        >
                           <IoHome />
                        </span>
                        <span className={`${styles.sideText}`}>Home</span>
                     </div>
                  </NavLink>
               </li>
               <li>
                  <NavLink
                     to="/blogs"
                     className={({ isActive }) => (isActive ? "font-bold" : "")}
                  >
                     <div
                        className={`${styles.sideHover} my-2 flex gap-3 items-center justify-center`}
                     >
                        <span className={`${styles.sideIcon} text-2xl`}>
                           <FaMicroblog />
                        </span>
                        <span className={`${styles.sideText}`}>Blog</span>
                     </div>
                  </NavLink>
               </li>
               {!isLoggedIn && (
                  <>
                     <li>
                        <NavLink
                           to="/login"
                           className={({ isActive }) => (isActive ? "font-bold" : "")}
                        >
                           <div
                              className={`${styles.sideHover} my-2 flex gap-3 items-center justify-center`}
                           >
                              <span className={`${styles.sideIcon} text-2xl`}>
                                 <IoLogIn />
                              </span>
                              <span className={`${styles.sideText}`}>Login</span>
                           </div>
                        </NavLink>
                     </li>
                     <li>
                        <NavLink
                           to="/signup"
                           className={({ isActive }) => (isActive ? "font-bold" : "")}
                        >
                           <div
                              className={`${styles.sideHover} my-2 flex gap-3 items-center justify-center`}
                           >
                              <span className={`${styles.sideIcon} text-2xl`}>
                                 <SiGnuprivacyguard />
                              </span>
                              <span className={`${styles.sideText}`}>SignUp</span>
                           </div>
                        </NavLink>
                     </li>
                  </>
               )}

               {isLoggedIn && (
                  <li>
                     <NavLink
                        to="/profile"
                        className={({ isActive }) => (isActive ? "font-bold" : "")}
                     >
                        <div
                           className={`${styles.sideHover} my-2 flex gap-3 items-center justify-center`}
                        >
                           <span className={`${styles.sideIcon} text-2xl`}>
                              <CgProfile />
                           </span>
                           <span className={`${styles.sideText}`}>Profile</span>
                        </div>
                     </NavLink>
                  </li>
               )}

               <li>
                  <NavLink
                     to="/shopping"
                     className={({ isActive }) => (isActive ? "font-bold" : "")}
                  >
                     <div
                        className={`${styles.sideHover} my-2 flex gap-3 items-center justify-center`}
                     >
                        <span className={`${styles.sideIcon} text-2xl`}>
                           <FaCartShopping />
                        </span>
                        <span className={`${styles.sideText}`}>Shopping</span>
                     </div>
                  </NavLink>
               </li>
               {isAdmin && (
                  <li>
                     <div
                        onClick={() => setOpenPayments(!openPayments)}
                        className={`${styles.sideHover} my-2 flex gap-3 items-center justify-center cursor-pointer`}
                     >
                        <span className={`${styles.sideIcon} text-2xl`}>
                           <MdPayments />
                        </span>
                        <span className={`${styles.sideText}`}>Payments</span>
                     </div>

                     {openPayments && (
                        <ul className="ml-6 flex flex-col gap-2 text-sm">
                           <li>
                              <NavLink
                                 to="/payments/add"
                                 className={({ isActive }) => (isActive ? "font-bold" : "")}
                              >
                                 Add Payment
                              </NavLink>
                           </li>
                           <li>
                              <NavLink
                                 to="/payments/history"
                                 className={({ isActive }) => (isActive ? "font-bold" : "")}
                              >
                                 Payment History
                              </NavLink>
                           </li>
                        </ul>
                     )}
                  </li>
               )}

               <li>
                  <NavLink
                     to="/chats"
                     className={({ isActive }) => (isActive ? "font-bold" : "")}
                  >
                     <div
                        className={`${styles.sideHover} my-2 flex gap-3 items-center justify-center`}
                     >
                        <span className={`${styles.sideIcon} text-2xl`}>
                           <BsChatSquareDots />
                        </span>
                        <span className={`${styles.sideText}`}>Chats</span>
                     </div>
                  </NavLink>
               </li>
               <li>
                  <NavLink
                     to="/contact"
                     className={({ isActive }) => (isActive ? "font-bold" : "")}
                  >
                     <div
                        className={`${styles.sideHover} my-2 flex gap-3 items-center justify-center`}
                     >
                        <span className={`${styles.sideIcon} text-2xl`}>
                           <RiContactsBook3Fill />
                        </span>
                        <span className={`${styles.sideText}`}>Contact</span>
                     </div>
                  </NavLink>
               </li>
            </ul>
         </nav>
      </div>
   );
};

export default Sidebar;
