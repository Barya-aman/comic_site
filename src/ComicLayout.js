// src/ComicLayout.js
import React from 'react';
import './ComicLayout.css';

const ComicLayout = ({ images }) => {
  return (
    <div className="comic-layout">
      {images.map((image, index) => (
        <div key={index} className="comic-panel">
          <img src={image} alt={`Comic Panel ${index + 1}`} className="comic-image"  />
        </div>
      ))}
    </div>
  );
};

export default ComicLayout;
