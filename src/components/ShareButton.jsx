import React from 'react';

const ShareButton = ({ title, audioUrl }) => {
  const shareAudio = () => {
    fetch(audioUrl)
      .then(r => r.blob())
      .then(blobFile => new File([blobFile], `${title}.mp3`, { type: "audio/mp3" }))
      .then(file => {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: title,
          })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
        } else {
          console.log("Your system doesn't support sharing files.");
        }
      })
      .catch((error) => console.log('Error fetching audio file', error));
  };

  return (
    <button onClick={shareAudio} className="share-button">
      Share
    </button>
  );
};

export default ShareButton;
