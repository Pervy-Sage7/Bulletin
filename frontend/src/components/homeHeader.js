import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function HomeHeader({
  isSidebar,
  searchValue,
  onSearchValueChange,
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            onChange={onSearchValueChange}
            placeholder="Search"
            className="p-2 px-4 rounded-full outline-none sm:w-96 text-black bg-opacity-80 bg-white"
          />
          {searchValue && (
            <IoIosCloseCircleOutline
              size={20}
              color="black"
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => onSearchValueChange({ target: { value: "" } })}
            />
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
