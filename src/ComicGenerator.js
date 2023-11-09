// src/ComicGenerator.js
import React, { useState } from 'react';
import ComicLayout from './ComicLayout';

const ComicGenerator = () => {
  const [panelTexts, setPanelTexts] = useState(Array(10).fill(''));
  const [generatedImages, setGeneratedImages] = useState(Array(10).fill(null));
  const [loading, setLoading] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [showComicLayout, setShowComicLayout] = useState(false);

  const query = async (data) => {
    const response = await fetch(
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        headers: {
          "Accept": "image/png",
          "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    return URL.createObjectURL(result);
  };

  const handleInputChange = (index, value) => {
    setPanelTexts((prevTexts) => {
      const newTexts = [...prevTexts];
      newTexts[index] = value;
      return newTexts;
    });
  };

  const handleSubmit = async (panelIndex) => {
    setLoading(true);

    try {
      const newImage = await query({ "inputs": panelTexts[panelIndex] });

      console.log("newImage is ", newImage,panelIndex)
      setGeneratedImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[panelIndex] = newImage;
        return newImages;
      });

      // Check if all panel images are generated
      const allImagesGenerated = generatedImages.every((image) => image !== null);
      console.log("all images genearated",allImagesGenerated, generatedImages)
      setIsSubmitEnabled(allImagesGenerated);
    } catch (error) {
      console.error('Error generating image:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleComicSubmit = () => {
  //   // Arrange all the images as a comic layout or perform any other desired action
  //   console.log('Submit comic layout:', generatedImages);
  // };

  const handleComicSubmit = () => {
    // Display the comic layout
    console.log('Submit comic layout:', generatedImages);

    // You can render the ComicLayout component here or perform other actions
    // For example, if you want to render the layout in the same component:
    setShowComicLayout(true);
  };

  return (
    <div>
      <h2>Comic Panel Text Input</h2>
      {panelTexts.map((text, index) => (
        <div key={index}>
          <label htmlFor={`panel${index + 1}`}>{`Panel ${index + 1}:`}</label>
          <input
            type="text"
            id={`panel${index + 1}`}
            value={text}
            onChange={(e) => handleInputChange(index, e.target.value)}
            required
          />
          <button type="button" onClick={() => handleSubmit(index)}>
            Generate Panel {index + 1} Comic
          </button>
          {generatedImages[index] && (
            <div>
              <h3>{`Panel ${index + 1} Image`}</h3>
              <img src={generatedImages[index]} alt={`Generated Comic ${index + 1}`} style={{ maxWidth: '100%' }} />
            </div>
          )}
        </div>
      ))}

      {loading && <p>Loading...</p>}
      {isSubmitEnabled && (
        <button type="button" onClick={handleComicSubmit}>
          Submit Comic
        </button>
      )}

       {/* Conditionally render the ComicLayout component */}
       {showComicLayout && (
        <div>
          <h2>Comic Layout</h2>
          <ComicLayout images={generatedImages} />
        </div>
      )}
    </div>
  );
};

export default ComicGenerator;
