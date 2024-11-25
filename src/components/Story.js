import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Story.css';
import placeholderImage from '../assets/background.png';
import nextButtonActive from '../assets/nextButton.png';

const Story = ({ selectedCharacters, selectedBackgrounds, selectedLength }) => {
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate('/making');
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
      <div className="main-title">이야기 요소</div>

      <div className="selected-items-container">
  {/* 선택된 등장인물 */}
  <div className="character-list">
    {selectedCharacters.map((character) => (
      <div key={character.id} className="character-card">
        <img src={character.image} alt={character.name} />
        <h3>{character.name}</h3>
      </div>
    ))}
  </div>

  {/* 선택된 배경 */}
  {selectedBackgrounds && (
    <div className="background-card">
      <img
        src={selectedBackgrounds[0].image}
        alt={selectedBackgrounds[0].name}
      />
      <h3>{selectedBackgrounds[0].name}</h3>
    </div>
  )}

  {/* 선택된 이야기 길이 */}
  {selectedLength && (
  <div className="selected-length">
    <img src={selectedLength.image} alt={selectedLength.length} />
    <h3>
      {selectedLength.length === 'len1' && '짧은 이야기'}
      {selectedLength.length === 'len2' && '중간 이야기'}
      {selectedLength.length === 'len3' && '긴 이야기'}
    </h3>
  </div>
)}

</div>


      {/* Next Button */}
      <div className="next-button-container">
        <img
          src={nextButtonActive}
          alt="Next Button"
          className="nextButton blinking-button"
          onClick={handleNextClick}
        />
      </div>
    </div>
  );
};

export default Story;
