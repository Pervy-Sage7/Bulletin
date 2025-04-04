import { useRef } from "react";
import { IoClose } from "react-icons/io5";
import { MdError } from "react-icons/md";

export function ErrorModal({ closeModal, text }) {
    const modalRef = useRef();
    const bgModal = (e) => {
      if (modalRef.current === e.target) {
        closeModal();
      }
    };
    return (
      <div
        ref={modalRef}
        onClick={bgModal}
        className="flex fixed justify-center w-screen h-screen left-0 top-0 p-5 text-white items-center backdrop-blur-lg z-[1000]"
        data-aos="fade-in"
      >
        <div className="flex flex-col items-center gap-5 bg-gradient-to-r from-[#34104A] to-[#250939] p-10 rounded-3xl z-[1000]">
          <div className="items-end justify-end flex w-full" data-aos="zoom-in">
            <button className="items-end justify-end flex ">
              <IoClose onClick={closeModal} size={30} />
              {/* <i className="ri-close-fill text-3xl" onClick={closeModal}></i> */}
            </button>
          </div>
          <MdError color="red" size={50} />
          {/* <i className="ri-close-circle-line text-7xl sm:text-8xl text-red-600"></i> */}
          <p className="text-center text-[14px] sm:text-[18px]">{text}</p>
        </div>
      </div>
    );
  }