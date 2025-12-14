import React, { useEffect, useState } from "react";
import BlogCard from "../components/Blog/BlogCard";
import { FaSearch } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import axios from "axios";
import SearchedBlogCard from "../components/Blog/SearchedBlogCard";
import { IoMdClose } from "react-icons/io";

interface Blog {
   id: number;
   title: string;
   description: string;
   image: string;
   category: string;
   author: string;
   createdAt: string;
}

function Blogs() {
   const [searchContent, setSearchContent] = useState(false);
   const [blogs, setBlogs] = useState<Blog[]>([]);

   useEffect(() => {
      const fetchBlogs = async () => {
         try {
            const response = await axios.get<Blog[]>(
               "http://localhost:5000/api/blogs"
            );
            setBlogs(response.data);
            console.log(response.data);
         } catch (error) {
            console.log(error);
         }
      };
      fetchBlogs();
   }, []);

   const [search, setSearch] = useState("");
   const [searchedBlog, setSearchedBlog] = useState<Blog[]>([]);

   const handleChange = async (e) => {
      setSearch(e.target.value);
   };

   const handleSearch = async () => {
      try {
         const response = await axios.get<Blog[]>(
            `http://localhost:5000/api/blogs/search?searchTerm=${search}`
         );
         console.log(response.data);
         setSearchedBlog(response.data);
      } catch (error) {
         console.log(error);
      }
      setSearchContent(true);
   };
   const handleSearchClose = () => {
      setSearchContent(false);
   };

   return (
      <>
         <div>
            {/* blog-section ============================================================================ */}
            <section
               id="blog"
               className="flex flex-col justify-center items-center  py-10 border-t border-b border-gray-200"
            >
               {/* blog-heading -------------- */}
               <div className="flex flex-col justify-center items-center">
                  <span className="text-red-500">My Recent Posts</span>
                  <h3 className="text-3xl text-gray-800 font-semibold">
                     My Blog
                  </h3>
               </div>
               {/* search bar */}
               <div className="mt-2 flex items-center justify-around">
                  <input
                     type="text"
                     value={search}
                     onChange={handleChange}
                     placeholder="search for blogs"
                     spellCheck="false"
                     className="border border-gray-300 outline-none bg-gray-50 text-gray-700 px-4 py-3 h-14 rounded-full flex-1 mr-4 text-lg"
                  />
                  {!searchContent ? (
                     <button
                        onClick={handleSearch}
                        className="border-none outline-none bg-gray-50 rounded-full w-14 h-14 cursor-pointer  flex justify-center items-center"
                     >
                        <FaSearch className="text-xl" />
                     </button>
                  ) : (
                     <button
                        onClick={handleSearchClose}
                        className="border-none outline-none bg-gray-50 rounded-full w-14 h-14 cursor-pointer  flex justify-center items-center"
                     >
                        <IoMdClose className="text-xl" />
                     </button>
                  )}
                  <NavLink to="/blogs/createBlog" className="ps-2">
                     <button className="border-none outline-none bg-gray-50 rounded-full w-14 h-14 cursor-pointer  flex justify-center items-center">
                        <IoAddOutline className="text-2xl" />
                     </button>
                  </NavLink>
               </div>

               {searchContent ? (
                  <div className="flex justify-center items-center my-5 flex-wrap flex-row container">
                     {searchedBlog.map((searchedBlog) => (
                        <SearchedBlogCard
                           id={searchedBlog._id}
                           title={searchedBlog.title}
                           description={searchedBlog.description}
                           image={`src/assets/blogs/${searchedBlog.image}`}
                           category={searchedBlog.category}
                           author={searchedBlog.author}
                           createdAt={searchedBlog.createdAt}
                        />
                     ))}
                  </div>
               ) : (
                  <div className="flex justify-center items-center my-5 flex-wrap flex-row container">
                     {blogs.map((blog) => (
                        <BlogCard
                           id={blog._id}
                           title={blog.title}
                           description={blog.description}
                           image={`src/assets/blogs/${blog.image}`}
                           category={blog.category}
                           author={blog.author}
                           createdAt={blog.createdAt}
                        />
                     ))}
                  </div>
               )}
            </section>
         </div>
      </>
   );
}

export default Blogs;
