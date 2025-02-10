import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { ErrorModal } from "./errorModal";
import { SuccessModal } from "./successModal";

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

export default function CreatePostModal({ onClose, onSuccess }) {
  const [newPost, setNewPost] = useState({ text: "", image: "" });
  const [previewUrl, setPreviewUrl] = useState(""); 
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isErrorModal, setIsErrorModal] = useState(false);

  const [isSuccessModal, setSuccessModal] = useState(false);
  const [successText, setSuccessText] = useState("");

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
          setNewPost({ text: "", image: "" });
          setPreviewUrl("");
          setSuccessText("Post Successfull.");
          setSuccessModal(true);
          setTimeout(() => {
            onSuccess();
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
  return (
    <div className="w-screen h-screen backdrop-blur-md fixed top-0 left-0 z-50">
      <Modal>
        <PostBox>
          <h2 className="text-2xl font-semibold mb-4">Create a Post</h2>
          <textarea
            value={newPost.text}
            onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
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
              onClick={() => handlePost()}
              className="px-4 py-2 bg-yellow-300 text-black rounded-md hover:bg-yellow-400 transition"
            >
              {isPostLoading ? "Posting..." : "Post"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </PostBox>
      </Modal>

      {isErrorModal && (
        <ErrorModal
          text={errorText}
          closeModal={() => setIsErrorModal(false)}
        />
      )}
      {isSuccessModal && <SuccessModal text={successText} />}
    </div>
  );
}
