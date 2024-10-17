import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios"; // For making API calls
import { IoClose } from "react-icons/io5";
import { MdError } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Modal = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const PostBox = styled.div`
  background: #1e1e1e;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export default function Homepage() {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "Adam",
      content: "Just had a great day at the beach!",
      image: "/images/tkm.png",
      likes: 10,
      comments: ["Looks amazing!", "Wish I was there!"],
    },
    {
      id: 2,
      username: "Eve",
      content: "Exploring the mountains 🏞️",
      image: "/images/happy.png",
      likes: 25,
      comments: ["Wow, that's beautiful!", "Great view!"],
    },
  ]);
  const [newPost, setNewPost] = useState({ text: "", image: "" });
  const [newComment, setNewComment] = useState(""); // Store new comment
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [previewUrl, setPreviewUrl] = useState(""); // Preview URL state for image/video
  const [isUserDetails, setIsUserDetails] = useState(true); // Preview URL state for image/video
  const [activeCommentSection, setActiveCommentSection] = useState(false); // Preview URL state for image/video

  const navigate = useNavigate();
  const access = localStorage.getItem("access");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsFetchingPosts(true);

    if (!access) {
      setErrorText("Access key not found.");
      setIsErrorModal(true);
      setIsFetchingPosts(false);
      return;
    }
    try {
      const response = await axios.get(
        "https://bulletin-xi93.onrender.com/user/allposts/",
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("fetchPost response: ", response);
      if (response?.data?.length > 0) {
        setPosts(response?.data);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsFetchingPosts(false);
    }
  };
  // Cloudinary Upload Logic
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "g7xxknev"); // Set up the preset in Cloudinary settings
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dnlr7dew3/upload`,
        formData
      );
      console.log("Link generated: ", response.data.secure_url);

      return response.data.secure_url; // Return the URL of the uploaded image
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      setErrorText("Error uploading media");
      setIsErrorModal(true);
      return null;
    }
  };

  // Handle new post creation
  const handlePost = async () => {
    setIsPostLoading(true);
    let mediaUrl = "";
    if (newPost.image) {
      console.log("initializing cloudinary...");
      mediaUrl = await uploadToCloudinary(newPost.image); // Upload the media first
      if (!mediaUrl) {
        setIsPostLoading(false); // Stop loading if upload fails
        return;
      }
    }

    const isImage = newPost.image && newPost.image.type.startsWith("image/");
    const isVideo = newPost.image && newPost.image.type.startsWith("video/");

    const postPayload = {
      description: newPost.text,
      image_link: isImage ? mediaUrl : "",
      video_link: isVideo ? mediaUrl : "",
    };

    console.log("payload: ", postPayload);

    const access = localStorage.getItem("access");
    if (!access) {
      console.log("access key not found...");
    }

    if (newPost.text || mediaUrl) {
      axios
        .post("https://bulletin-xi93.onrender.com/user/posts/", postPayload, {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // Add the new post to the list
          setPosts([response.data, ...posts]);
          setNewPost({ text: "", image: "" });
          setShowModal(false);
          setPreviewUrl(""); // Clear preview after posting
          setIsPostLoading(false);
          setSuccessText("Post Successfull.");
          setSuccessModal(true);
          setTimeout(() => {
            setSuccessModal(false);
          }, 2000);
        })
        .catch((error) => {
          console.error("Error posting:", error);
          setErrorText(error?.response?.data?.message || "Error Posting...");
          setIsErrorModal(true);
        })
        .finally(() => setIsPostLoading(false));
    } else {
      setErrorText("Please enter some text or upload an image.");
      setIsErrorModal(true);
      setIsPostLoading(false);
    }
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({
        ...newPost,
        image: file, // Store the file to be uploaded later
      });
      setPreviewUrl(URL.createObjectURL(file)); // Generate preview URL for display
    }
  };

  // Handle liking a post
  const handleLike = async (postId) => {
    const access = localStorage.getItem("access");
    if (!access) {
      setErrorText("Access key not found.");
      setIsErrorModal(true);
      return;
    }

    try {
      // Assuming your API accepts a POST request to like a post
      const response = await axios.post(
        `https://bulletin-xi93.onrender.com/user/posts/${postId}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state to reflect new like count
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: response.data.likes_count }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
      setErrorText("Error liking post.");
      setIsErrorModal(true);
    }
  };

  // Handle adding a new comment to a post
  const handleComment = async (postId) => {
    if (!newComment.trim()) {
      setErrorText("Comment cannot be empty.");
      setIsErrorModal(true);
      return;
    }

    const access = localStorage.getItem("access");
    if (!access) {
      setErrorText("Access key not found.");
      setIsErrorModal(true);
      return;
    }

    const data = { comment_text: newComment };

    console.log("data: ", data);

    try {
      const response = await axios.post(
        `https://bulletin-xi93.onrender.com/user/posts/${postId}/comments/create/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );

      // fetchPosts();
      // Update the post comments in local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, response.data] }
            : post
        )
      );

      // Clear the comment input
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setErrorText("Error adding comment.");
      setIsErrorModal(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="text-white">
      <nav className="p-5 px-20 flex items-center justify-between w-screen fixed top-0 bg-black z-50">
        <a href="/" onClick={scrollToTop}>
          <img src="/images/logo.png" alt="Logo" className="w-28" />
        </a>
        <div className="flex items-center space-x-4">
          <button
            onClick={scrollToTop}
            className="px-4 py-2 bg-yellow-300 text-black rounded-full font-semibold hover:bg-yellow-400 transition duration-200"
          >
            Home
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-yellow-300 text-black rounded-full font-semibold hover:bg-yellow-400 transition duration-200"
          >
            Post Something
          </button>
          <img
            src="/images/adam.png"
            className="w-14 cursor-pointer"
            alt="User Avatar"
            onClick={() => setIsUserDetails(!isUserDetails)}
          />
        </div>
      </nav>

      <section className="max-w-3xl mx-auto p-6 space-y-6 mt-20">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src="/images/adam.png"
                alt="Avatar"
                className="w-12 h-12 rounded-full"
              />
              <span className="font-semibold">{post?.alumni?.username}</span>
            </div>
            <p>{post?.description}</p>
            {post?.image_link && (
              <img
                src={post?.image_link}
                alt="Post Content"
                className="rounded-lg"
              />
            )}
            {post?.video_link && (
              <video
                controls
                src={post?.video_link}
                className="w-full h-auto rounded-lg"
              />
            )}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleLike(post.id)}
                className="text-yellow-300 hover:text-yellow-400"
              >
                ❤️ {post?.likes > 0 ? post?.likes : 0} Likes
              </button>
              <button
                className="text-yellow-300 hover:text-yellow-400"
                onClick={() => setActiveCommentSection(post?.id)}
              >
                💬 {post.comments.length || 0} Comments
              </button>
            </div>

            {/* Comment section */}
            <div className="space-y-2">
              {post?.comments?.length > 0 ? (
                post?.comments?.map((comment, index) => (
                  <p key={index} className="text-gray-400">
                    {comment?.comment_text}
                  </p>
                ))
              ) : (
                <span>No comments...</span>
              )}
              {activeCommentSection == post?.id && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                    placeholder="Write a comment..."
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    className="px-4 py-2 bg-yellow-300 text-black rounded-md hover:bg-yellow-400"
                  >
                    {isCommentLoading ? "Loading" : "Comment"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Modal for posting new content */}
      {showModal && (
        <div className="w-screen h-screen backdrop-blur-md fixed top-0 left-0 z-50">
          <Modal>
            <PostBox>
              <h2 className="text-2xl font-semibold mb-4">Create a Post</h2>
              <textarea
                value={newPost.text}
                onChange={(e) =>
                  setNewPost({ ...newPost, text: e.target.value })
                }
                className="w-full p-2 mb-4 bg-black bg-opacity-30"
                rows="4"
                placeholder="What's on your mind?"
              />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                className="mb-4"
              />

              {/* Preview section */}
              {previewUrl && (
                <div className="mb-4">
                  {newPost.image.type.startsWith("image/") ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto rounded-lg"
                    />
                  ) : (
                    <video
                      controls
                      src={previewUrl}
                      className="w-full h-auto rounded-lg"
                    />
                  )}
                </div>
              )}

              <div className="flex justify-end gap-5">
                <button
                  onClick={handlePost}
                  className="px-4 py-2 bg-yellow-300 text-black rounded-md hover:bg-yellow-400 transition"
                >
                  {isPostLoading ? "Posting..." : "Post"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </PostBox>
          </Modal>
        </div>
      )}

      {/* Error modal */}
      {isErrorModal && (
        <ErrorModal
          closeModal={() => setIsErrorModal(false)}
          text={errorText}
        />
      )}
      {successModal && <SuccessModal text={successText} />}

      <div
        className={`fixed top-[15rem] w-72 bg-white bg-opacity-10 p-5 rounded-r-xl transition-all ${
          isUserDetails ? "left-0" : "-left-full"
        }`}
      >
        <div className="flex flex-col items-center gap-2 justify-center">
          <img src="/images/adam.png" className="w-32"></img>
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
    </div>
  );
}

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

export function SuccessModal({ text }) {
  return (
    <div
      // ref={modalRef}
      // onClick={bgModal}
      className="flex fixed justify-center w-screen h-screen left-0 top-0 p-5 text-white items-center backdrop-blur-lg z-[1000]"
      data-aos="fade-in"
    >
      <div className="flex flex-col items-center gap-5 bg-gradient-to-r from-[#34104A] to-[#250939] p-10 rounded-3xl z-[1000]">
        <div className="items-end justify-end flex w-full" data-aos="zoom-in">
          {/* <button className="items-end justify-end flex ">
            <IoClose onClick={closeModal} size={30} />
          </button> */}
        </div>
        <FaCheckCircle color="green" size={50} />
        {/* <i className="ri-close-circle-line text-7xl sm:text-8xl text-red-600"></i> */}
        <p className="text-center text-[14px] sm:text-[18px]">{text}</p>
      </div>
    </div>
  );
}
