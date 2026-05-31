import { useState } from "react";

import { getInitials } from './../../utils/helpers';

const Avatar = ({ radio, isPlaying }) => {
  const [imgError, setImgError] = useState(false);
  const hasImage = radio.image && !radio.image.endsWith("/");

  if (hasImage && !imgError) {
    return (
      <div className={`avatar${isPlaying ? " avatar--playing" : ""}`}>
        <img
          src={radio.image}
          alt={radio.name}
          onError={() => setImgError(true)}
          className="avatar__img"
        />
      </div>
    );
  }

  return (
    <div className={`avatar__initials${isPlaying ? " avatar__initials--playing" : ""}`}>
      {getInitials(radio.name)}
    </div>
  );
};

export default Avatar;
