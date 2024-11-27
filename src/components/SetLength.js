import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import placeholderImage from '../assets/background.png'; 
import len1 from '../assets/length/len1.png';  
import len2 from '../assets/length/len2.png';  
import len3 from '../assets/length/len3.png';  
import nextButtonInactive from '../assets/inactiveNextButton.png'; 
import nextButtonActive from '../assets/finishButton.png'; 
import '../styles/MainPage.css';
import '../styles/SetLength.css';

const SetLength = ({ setSelectedLength }) => {
  const [selectedLengthState, setSelectedLengthState] = useState(null);  
  const [hoveredImage, setHoveredImage] = useState(null); 
  const navigate = useNavigate();  

  const lengthImages = {
    len1: len1,
    len2: len2,
    len3: len3,
  };

  const handleImageClick = (length) => {
    setSelectedLengthState(length);
    setSelectedLength({ length, image: lengthImages[length] }); // 전달할 때 길이와 이미지 같이 전달
  };

  const handleMouseEnter = (length) => {
    if (!selectedLengthState) {
      setHoveredImage(length);
    }
  };

  const handleMouseLeave = () => {
    if (!selectedLengthState) {
      setHoveredImage(null);
    }
  };

  const handleNextClick = () => {
    if (selectedLengthState) {
      console.log(`선택된 길이: ${selectedLengthState} - 전송됩니다.`);
      navigate('/story'); 
    }
  };

  return (
    <div 
      className="main-container"
      style={{ 
        backgroundImage: `url(${placeholderImage})`,  
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="main-title"> 동화 길이 선택</div>

      <div className="image-container">
        <div 
          className="image-item" 
          onClick={() => handleImageClick('len1')}
          onMouseEnter={() => handleMouseEnter('len1')}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={len1} 
            alt="len1" 
            className={`length-image ${hoveredImage === 'len1' ? 'hovered' : ''}`} 
          />
          <div className="image-text">짧은 이야기</div>
        </div>
        <div 
          className="image-item" 
          onClick={() => handleImageClick('len2')}
          onMouseEnter={() => handleMouseEnter('len2')}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={len2} 
            alt="len2" 
            className={`length-image ${hoveredImage === 'len2' ? 'hovered' : ''}`} 
          />
          <div className="image-text">중간 이야기</div>
        </div>
        <div 
          className="image-item" 
          onClick={() => handleImageClick('len3')}
          onMouseEnter={() => handleMouseEnter('len3')}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={len3} 
            alt="len3" 
            className={`length-image ${hoveredImage === 'len3' ? 'hovered' : ''}`} 
          />
          <div className="image-text">긴 이야기</div>
        </div>
      </div>

      <div className="next-button-container">
        <img 
          src={selectedLengthState ? nextButtonActive : nextButtonInactive} 
          alt="Next Button" 
          className={selectedLengthState ? "FinButton" : "inactiveNextButton"} 
          onClick={handleNextClick} 
        />
      </div>
    </div>
  );
};

export default SetLength;
