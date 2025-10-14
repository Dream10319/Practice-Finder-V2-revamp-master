import { IMAGES } from "@/constants";
import React, { useState } from "react";
import { FaPlay } from "react-icons/fa"; // You might need to install 'react-icons'

/**
 * A component to embed a video that initially shows a thumbnail
 * with a centered play button.
 */
const VideoEmbed: React.FC = () => {
  // State to track if the iframe (video) should be loaded/playing
  const [isPlaying, setIsPlaying] = useState(false);

  // The placeholder image URL from your constants
  const thumbnailUrl = IMAGES.INTRO_VIDEO_THUMBNAIL; // Assuming you have a thumbnail URL in IMAGES

  // Fallback to a plain color if a thumbnail image isn't available or defined
  const thumbnailStyle = thumbnailUrl
    ? { backgroundImage: `url(${thumbnailUrl})` }
    : { backgroundColor: "#000" }; // A simple black background

  /**
   * Function to switch from thumbnail to the actual video embed
   */
  const handleThumbnailClick = () => {
    setIsPlaying(true);
  };

  return (
    <div
      id="llo_yii7a2lctdfl6hw9o00g376v"
      // This wrapper provides the 16:9 aspect ratio and establishes a positioning context
      style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}
    >
      {isPlaying ? (
        /* * 1. VIDEO EMBED (Active State) 
         * Loads and displays the iframe for the video.
         */
        <iframe
          // Use a key to ensure the iframe fully remounts if logic changes, though not strictly necessary here
          key="video-iframe"
          src={IMAGES.INTRO_VIDEO}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="Intro Video"
        ></iframe>
      ) : (
        /* * 2. THUMBNAIL PLACEHOLDER (Initial State) 
         * Shows the clickable thumbnail with a centered play button.
         */
        <div
          key="video-thumbnail"
          onClick={handleThumbnailClick}
          style={{
            ...thumbnailStyle,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            cursor: "pointer",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex", // For centering the play button
            justifyContent: "center", // Horizontal center
            alignItems: "center", // Vertical center
          }}
          role="button"
          aria-label="Play video"
        >
          {/* Play Button Icon */}
          {/* Note: You need to install 'react-icons' (e.g., 'npm install react-icons') */}
          <div
            style={{
              // Style the play button container
              backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent black background
              borderRadius: "50%", // Make it circular
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* The actual play icon from react-icons/fa */}
            <FaPlay
              size={30} // Icon size
              color="#fff" // White icon color
              style={{ marginLeft: "3px" }} // Slight nudge for optical center
            />
          </div>
        </div>
      )}
      {/* The padding div is no longer needed inside the wrapper because 
          we apply 'paddingTop: "56.25%"' directly to the wrapper div. */}
    </div>
  );
};

export default VideoEmbed;