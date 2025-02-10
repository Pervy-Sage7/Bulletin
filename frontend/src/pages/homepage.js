import React, { useState, useEffect } from "react";
import axios from "axios"; // For making API calls
import HomeHeader from "../components/homeHeader";
import { ErrorModal } from "../components/errorModal";
import SideBar from "../components/sideBar";
import { SuccessModal } from "../components/successModal";
import CreatePostModal from "../components/createPostModal";

export default function Homepage() {
  const [isCreatePostModal, setIsCreatePostModal] = useState(false);
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

  const [newComment, setNewComment] = useState("");
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [isSuccessModal, setSuccessModal] = useState(false);
  const [isSidebar, setIsSidebar] = useState(true);

  const [isFetchingPosts, setIsFetchingPosts] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [activeCommentSection, setActiveCommentSection] = useState(false);

  // const navigate = useNavigate();

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
    setIsCommentLoading(true);

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

      fetchPosts();
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
    } finally {
      setIsCommentLoading(false);
    }
  };

  return (
    <div className="text-white">
      <HomeHeader
        isSidebar={() => setIsSidebar(!isSidebar)}
        isShowModal={() => setIsCreatePostModal(true)}
      />

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
      {isCreatePostModal && (
        <CreatePostModal
          onClose={() => setIsCreatePostModal(false)}
          onSuccess={() => {
            setIsCreatePostModal(false);
            fetchPosts();
          }}
        />
      )}

      {isErrorModal && (
        <ErrorModal
          closeModal={() => setIsErrorModal(false)}
          text={errorText}
        />
      )}
      {isSuccessModal && <SuccessModal text={successText} />}

      {isSidebar && <SideBar isSidebar={isSidebar} />}
    </div>
  );
}
