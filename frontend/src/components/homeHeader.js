import React from "react";

export default function HomeHeader({ isSidebar, isShowModal }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="p-5 sm:px-20 flex items-center justify-between w-screen fixed top-0 bg-black z-50">
      <div className="cursor-pointer" onClick={scrollToTop}>
        <img src="/images/logo.png" alt="Logo" className="w-28" />
      </div>
      <div className="flex items-center space-x-4">
        {/* <button
            onClick={scrollToTop}
            className="px-4 py-2 bg-yellow-300 text-black rounded-full font-semibold hover:bg-yellow-400 transition duration-200"
          >
            Home
          </button> */}
        <button
          onClick={isShowModal}
          className="px-6 py-2 bg-yellow-300 text-black rounded-full font-semibold hover:bg-yellow-400 transition duration-200"
        >
          Post Something
        </button>
        <img
          src="/images/adam.png"
          className="w-14 cursor-pointer"
          alt="User Avatar"
          onClick={isSidebar}
        />
      </div>
    </nav>
  );
}
