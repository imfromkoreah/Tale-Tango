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
      <div className="main-title">이야기 제작</div>

      {/* 선택된 등장인물 카드들 */}
      <div className="selected-characters">
        <h2>선택한 등장인물:</h2>
        <div className="character-list">
          {selectedCharacters.map((character) => (
            <div key={character.id} className="character-card">
              <img src={character.image} alt={character.name} />
              <p>{character.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 선택된 배경 카드 */}
      <div className="selected-background">
        {selectedBackgrounds && (
          <div className="background-card">
            <img
              src={selectedBackgrounds[0].image}
              alt={selectedBackgrounds[0].name}
            />
            <p>{selectedBackgrounds[0].name}</p>
          </div>
        )}
      </div>

      {/* 선택된 이야기 길이 */}
      <div className="selected-length">
        {selectedLength && (
          <div>
            <p>
              {selectedLength.length === 'len1' && '짧은 이야기'}
              {selectedLength.length === 'len2' && '중간 이야기'}
              {selectedLength.length === 'len3' && '긴 이야기'}
            </p>
            <img src={selectedLength.image} alt={selectedLength.length} />
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
