import React from "react";
import { useNavigate } from "react-router-dom";

export default function SideBar({ isSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      className={`fixed top-[15rem] w-72 bg-white bg-opacity-10 p-5 rounded-r-xl transition-all ${
        isSidebar ? "left-0" : "-left-full"
      }`}
    >
      <div className="flex flex-col items-center gap-2 justify-center">
        <img alt="adam" src="/images/adam.png" className="w-32"></img>
        <span className="font-mono">
          username:{" "}
          <span className="font-semibold">
            {localStorage.getItem("username") || "Adam"}
          </span>
        </span>
        <span className="font-mono ">
          email:{" "}
          <span className="font-semibold">
            {localStorage.getItem("email") || "Adam"}
          </span>
        </span>
        <span className="font-mono ">
          company:{" "}
          <span className="font-semibold">
            {localStorage.getItem("company") || "Adam"}
          </span>
        </span>
        <span className="font-mono ">
          designation:{" "}
          <span className="font-semibold">
            {localStorage.getItem("designation") || "Adam"}
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
      </div>
    </div>
  );
}
