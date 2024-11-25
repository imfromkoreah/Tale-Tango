import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router 훅 import
import placeholderImage from '../assets/background.png'; // 배경 이미지 import
import '../styles/SetCharacter.css';
import nextButtonInactive from '../assets/inactiveNextButton.png'; // 비활성화된 버튼 이미지
import nextButtonActive from '../assets/nextButton.png'; // 활성화된 버튼 이미지

// 등장인물 데이터
const characters = [
  { id: 1, name: '야수', image: require('../assets/character/beast.png') },
  { id: 2, name: '벨', image: require('../assets/character/belle.png') },
  { id: 3, name: '장화 신은 고양이', image: require('../assets/character/cat-in-boots.png') },
  { id: 4, name: '신데렐라', image: require('../assets/character/cinderella.png') },
  { id: 5, name: '드래곤', image: require('../assets/character/dragon.png') },
  { id: 6, name: '요정할머니', image: require('../assets/character/grandmother.png') },
  { id: 7, name: '피터팬', image: require('../assets/character/peterpan.png') },
  { id: 8, name: '피노키오', image: require('../assets/character/pinocchio.png') },
  { id: 9, name: '왕자님', image: require('../assets/character/prince.png') },
  { id: 10, name: '라푼젤', image: require('../assets/character/rapunzel.png') },
  { id: 11, name: '허수아비', image: require('../assets/character/scarecrow.png') },
  { id: 12, name: '백설공주', image: require('../assets/character/snow-white.png') },
  { id: 13, name: '타잔', image: require('../assets/character/tarzan.png') },
];

// 랜덤으로 10개의 캐릭터를 뽑는 함수
const getRandomCharacters = () => {
  const shuffled = [...characters].sort(() => 0.5 - Math.random()); // 배열을 랜덤으로 섞기
  return shuffled.slice(0, 10); // 10개만 선택
};

// 카드 데이터 (랜덤 배치된 캐릭터들)
const cardData = getRandomCharacters().map((character, index) => ({
  id: index + 1,
  image: character.image,
  characterId: character.id,
}));

const SetCharacter = ({ setSelectedCharacters }) => {
  const [selectedCards, setSelectedCards] = useState([]); // 선택된 카드들
  const [selectedCardIds, setSelectedCardIds] = useState([]); // 선택된 등장인물 ID들
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const handleCardClick = (cardId, characterId) => {
    if (selectedCardIds.includes(characterId)) {
      // 이미 선택된 카드라면 선택 취소
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
      setSelectedCardIds(selectedCardIds.filter((id) => id !== characterId));
    } else if (selectedCards.length < 3) {
      // 최대 3개까지 선택 가능
      setSelectedCards([...selectedCards, cardId]);
      setSelectedCardIds([...selectedCardIds, characterId]);
    }
  };

  const handleNextPage = () => {
    if (selectedCards.length < 2) {
      alert('최소 2개의 카드를 선택해야 합니다.');
    } else {
      // 선택된 캐릭터들 필터링
      const selectedCharacters = characters.filter((character) =>
        selectedCardIds.includes(character.id)
      );
  
      // 선택된 캐릭터들을 콘솔에 출력
      console.log('선택된 캐릭터들:', selectedCharacters);
  
      setSelectedCharacters(selectedCharacters); // 부모 컴포넌트로 선택된 캐릭터 전달
      navigate('/background'); // SetBackground 페이지로 이동
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
      {/* Main Title */}
      <div className="main-title">등장인물 선택</div>

      {/* 카드 슬라이더 */}
      <div className="card-slider" aria-label="카드 슬라이더">
        {cardData.map((item) => (
          <div
            key={item.id}
            className={`card ${selectedCards.includes(item.id) ? 'active' : ''}`}
            role="button"
            tabIndex="0"
            aria-label={`카드 ${item.id}`}
            onClick={() => handleCardClick(item.id, item.characterId)}
          >
            <div className="inner-card">
              {selectedCards.includes(item.id) && (
                <img src={item.image} alt={`character-${item.characterId}`} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 선택된 카드 수 표시 */}
      <div className="selected-count">
        선택된 카드 수: {selectedCards.length} / 3
      </div>

      {/* Next Button */}
      <div className="next-button-container">
        <img
          src={selectedCards.length >= 2 ? nextButtonActive : nextButtonInactive}
          alt="Next Button"
          className={selectedCards.length >= 2 ? 'nextButton' : 'inactiveNextButton'}
          onClick={selectedCards.length >= 2 ? handleNextPage : undefined}
        />
      </div>
    </div>
  );
};

export default SetCharacter;
