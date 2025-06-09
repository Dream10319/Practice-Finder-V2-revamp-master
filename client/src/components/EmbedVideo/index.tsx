import React from "react";

const VideoEmbed: React.FC = () => {
  return (
    <div
      id="llo_yii7a2lctdfl6hw9o00g376v"
      style={{ position: "relative", width: "100%" }}
    >
      <iframe
        src="https://d1bkwqif2ae4kl.cloudfront.net/videos/static/player/index.html?videoId=yii7a2lctdfl6hw9o00g376v"
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
      <div style={{ paddingTop: "56.25%" }}></div>
    </div>
  );
};

export default VideoEmbed;
