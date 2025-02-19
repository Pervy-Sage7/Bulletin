import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

export default function HomeHeader({ isSidebar }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const access = localStorage.getItem("access");
  const navigate = useNavigate();

  const fetchUsers = async () => {  
    setIsLoading(true);

    // if (!access) { 
    //   setErrorText("Access key not found."); 
    //   setIsErrorModal(true); 
    //   setIsFetchingPosts(false); 
    //   setIsLoading(false);
    //   return;
    // }
    try {
      const response = await axios.get(
        `https://bulletin-xi93.onrender.com/user/allposts/?search=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("fetchPost response: ", response.data);
      if (response?.data) {
        console.log("users: ", response?.data);

        setUsers(response?.data);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("searchValue: ", searchValue);
    if (searchValue == "") {
      setUsers([]);
    } else {
      fetchUsers();
    }
  }, [searchValue]);

  return (
    <nav className="p-5 sm:px-20 flex items-center justify-between w-screen fixed top-0 bg-black z-50">
      <div className="cursor-pointer" onClick={scrollToTop}>
        <img src="/images/logo.png" alt="Logo" className="w-28" />
      </div>
      <div className="flex items-center space-x-4 ">
        {/* <button
            onClick={scrollToTop}
            className="px-4 py-2 bg-yellow-300 text-black rounded-full font-semibold hover:bg-yellow-400 transition duration-200"
          >
            Home
          </button> */}
        <div className="relative w-full h-full flex items-center">
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
            className="p-2 px-4 rounded-full outline-none sm:w-96 text-black bg-opacity-80 bg-white"
          />
          {searchValue && (
            <div className="absolute right-3 top-3 cursor-pointer">
              {isLoading ? (
                <RotatingLines
                  visible={true}
                  height="20"
                  width="20"
                  color="black"
                  strokeWidth="5"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                  wrapperStyle={{ color: "black" }}
                  wrapperClass=""
                />
              ) : (
                <IoIosCloseCircleOutline
                  size={20}
                  color="black"
                  onClick={() => setSearchValue("")}
                />
              )}
            </div>
          )}

          {users?.length > 0 && (
            <div className="absolute flex flex-col gap-3 top-full left-0 bg-black rounded-lg p-5 px-10 w-64">
              {users?.map((user, index) => (
                <div
                  className="flex gap-3 cursor-pointer"
                  onClick={() => navigate(`/user/${user?.username}`)}
                >
                  <div className="flex items-center justify-center p-1 rounded-full">
                    {/* {user?.profile_picture_url ? (
                      <img
                        alt={user?.id}
                        src={user?.profile_picture_url}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <RxAvatar size={50} />
                    )} */}
                    <RxAvatar size={40} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{user?.username}</span>
                    {/* <span>|</span> */}
                    <span className="font-light text-[10px]">
                      {user?.company}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* <button
          onClick={isShowModal}
          className="px-6 py-2 bg-yellow-300 text-black rounded-full font-semibold hover:bg-yellow-400 transition duration-200"
        >
          Add Post
        </button> */}
        <img
          src="/images/adam.png"
          className="w-10 sm:w-14 cursor-pointer"
          alt="User Avatar"
          onClick={isSidebar}
        />
      </div>
    </nav>
  );
}
