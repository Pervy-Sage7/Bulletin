import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SideBar({ isSidebar, toggleSidebar }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );

  useEffect(() => {
    console.log("sideBar: ", userData);
  }, [userData]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div
      className={`fixed top-[15rem] w-72 bg-black lg:bg-white bg-opacity-100 lg:bg-opacity-10 p-5 rounded-r-2xl transition-all duration-500 ${
        isSidebar ? "left-0" : "hidden"
      }`}
      style={{ border: "solid white" }}
      data-aos="fade-in"
    >
      {/* <div className="flex flex-col items-center justify-center border border-white" > */}
      <div className="flex flex-col items-center gap-2 justify-center text-center text-slate-300">
        <img
          alt="adam"
          src={userData?.profile_picture_url || "/images/adam.png"}
          // src={userData?.profile_picture_url || "/images/adam.png"}
          className="w-24 h-24 rounded-full cursor-pointer"
          onClick={() => navigate(`/user/${userData?.username}`)}
        ></img>
        <span className="font-mono">
          Username:{" "}
          <span className="font-semibold text-white">
            {userData?.username || "Adam"}
          </span>
        </span>
        <span className="font-mono ">
          Email:{" "}
          <span className="font-semibold text-white">
            {userData?.email || "Adam"}
          </span>
        </span>
        <span className="font-mono ">
          Company:{" "}
          <span className="font-semibold text-white">
            {userData?.company || "Adam"}
          </span>
        </span>
        <span className="font-mono ">
          Designation:{" "}
          <span className="font-semibold text-white">
            {userData?.designation || "Adam"}
          </span>
        </span>
        {/* <span className="font-mono font-semibold">email: {localStorage.getItem("email") || "Adam"}</span>
          <span className="font-mono font-semibold">company: {localStorage.getItem("company") || "Adam"}</span>
          <span className="font-mono font-semibold">designation: {localStorage.getItem("designation") || "Adam"}</span> */}
      </div>
      <div className="flex justify-center">
        <button
          className="p-2 px-4 rounded-xl bg-yellow-500 mt-5 flex justify-center"
          onClick={handleLogout}
        >
          Logout
        </button>
        {/* </div> */}
      </div>
      <div
        className="absolute right-0 top-[50%] cursor-pointer"
        onClick={toggleSidebar}
      >
        <FaChevronLeft size={30} />
      </div>
    </div>
  );
}
