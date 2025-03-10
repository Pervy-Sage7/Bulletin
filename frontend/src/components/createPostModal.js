import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { ErrorModal } from "./errorModal";
import { SuccessModal } from "./successModal";

const Modal = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  overflow-y: auto;
  padding: 20px 0;
`;

const PostBox = styled.div`
  background: #1e1e1e;
  padding: 24px;
  width: 90%;
  max-width: 550px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-height: 85vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  
  /* Custom scrollbar for the PostBox */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #2d2d2d;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #777;
  }
`;

const PreviewContainer = styled.div`
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  max-height: 400px;
  overflow-y: auto;
  
  /* Custom scrollbar for the preview container */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #2d2d2d;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #777;
  }
`;

const StyledButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 10px 16px;
  background: #2d2d2d;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #3d3d3d;
  }
  
  input[type="file"] {
    display: none;
  }
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
      <Modal data-aos="fade-in">
        <PostBox data-aos="zoom-in">
          <h2 className="text-2xl font-semibold mb-5">Create a Post</h2>
          <textarea
            value={newPost.text}
            onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
            className="w-full p-3 mb-5 bg-black bg-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
            rows="4"
            placeholder="What's on your mind?"
          />
          
          <FileInputLabel>
            <span>📎 Upload Image or Video</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
            />
          </FileInputLabel>

          {/* Preview section */}
          {previewUrl && (
            <PreviewContainer>
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
            </PreviewContainer>
          )}

          <div className="flex justify-end gap-4 mt-2">
            <StyledButton
              onClick={onClose}
              className="bg-gray-700 text-white hover:bg-gray-600"
            >
              Cancel
            </StyledButton>
            <StyledButton
              onClick={() => handlePost()}
              className="bg-yellow-300 text-black hover:bg-yellow-400"
              disabled={isPostLoading}
            >
              {isPostLoading ? "Posting..." : "Post"}
            </StyledButton>
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
