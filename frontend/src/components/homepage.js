import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios"; // For making API calls
import { IoClose } from "react-icons/io5";
import { MdError } from "react-icons/md";

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
  const [errorText, setErrorText] = useState("");

  // Fetch posts from the API
  // useEffect(() => {
  //   axios.get("/api/posts").then((response) => {
  //     setPosts(response.data);
  //   });
  // }, []);

  // Handle new post creation
  const handlePost = () => {
    setIsPostLoading(true);
    if (newPost.text || newPost.image) {
      axios
        .post("/api/posts", newPost)
        .then((response) => {
          // Add the new post to the list
          setPosts([response.data, ...posts]);
          setNewPost({ text: "", image: "" });
          setShowModal(false);
        })
        .catch((error) => {
          console.error("Error posting:", error);
          setErrorText("Error posting...");
          setIsErrorModal(true);
        })
        .finally(() => setIsPostLoading(false)); // Wrap in a function to ensure it runs after the promise
    }
  };

  // Handle liking a post
  const handleLike = (postId) => {
    axios
      .post(`/api/posts/${postId}/like`)
      .then((response) => {
        // Update the liked post in the list
        const updatedPosts = posts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        );
        setPosts(updatedPosts);
      })
      .catch((error) => console.error("Error liking post:", error));
  };

  // Handle adding a comment
  const handleComment = (postId) => {
    setIsCommentLoading(true);
    if (newComment) {
      axios
        .post(`/api/posts/${postId}/comment`, { text: newComment })
        .then((response) => {
          // Update the commented post in the list
          const updatedPosts = posts.map((post) =>
            post.id === postId
              ? { ...post, comments: response.data.comments }
              : post
          );
          setPosts(updatedPosts);
          setNewComment(""); // Clear the comment input
        })
        .catch((error) => {
          console.error("Error adding comment:", error);
          setErrorText("Error adding comment...");
          setIsErrorModal(true);
        })
        .finally(setIsCommentLoading(false));
    } else {
      setErrorText("No comment found");
      setIsErrorModal(true);
      setIsPostLoading(false);
    }
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const mediaType = file.type.startsWith("video/") ? "video" : "image";
      setNewPost({
        ...newPost,
        media: URL.createObjectURL(file), // Create URL for preview
        mediaType,
      });
    }
  };

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="text-white">
      <nav className="p-5 px-20 flex items-center justify-between w-screen fixed top-0 bg-black">
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
          <img src="/images/adam.png" className="w-14" alt="User Avatar" />
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
              <span className="font-semibold">{post.username}</span>
            </div>
            <p>{post.content}</p>
            {post.image && (
              <img src={post.image} alt="Post Content" className="rounded-lg" />
            )}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleLike(post.id)}
                className="text-yellow-300 hover:text-yellow-400"
              >
                ❤️ {post.likes} Likes
              </button>
              <button className="text-yellow-300 hover:text-yellow-400">
                💬 {post.comments.length} Comments
              </button>
            </div>

            {/* Comment section */}
            <div className="space-y-2">
              {post.comments.map((comment, index) => (
                <p key={index} className="text-gray-400">
                  {comment}
                </p>
              ))}
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
            </div>
          </div>
        ))}
      </section>

      {/* Modal for posting new content */}
      {showModal && (
        <div className="w-screen h-screen backdrop-blur-md fixed top-0 left-0">
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
              ></textarea>
              <input
                type="file"
                accept="image/*,video/*" // Accept both images and videos
                onChange={handleMediaUpload}
                className="mb-4"
              />
              {newPost.media && (
                <img
                  src={newPost.media}
                  alt="Preview"
                  className="w-full rounded-md mb-4"
                />
              )}
              <div className="flex justify-end gap-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Close
                </button>
                <button
                  onClick={handlePost}
                  className="px-4 py-2 bg-yellow-300 text-black rounded-md hover:bg-yellow-400"
                >
                  {isPostLoading ? "Loading" : "Post"}
                </button>
              </div>
            </PostBox>
          </Modal>
        </div>
      )}

      {/* Error Modal */}
      {isErrorModal && (
        <ErrorModal
          closeModal={() => setIsErrorModal(false)}
          text={errorText}
        />
      )}
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
