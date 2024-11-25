import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router 훅 import
import placeholderImage from '../assets/background.png'; // 배경 이미지 import
import '../styles/SetBackground.css';
import nextButtonInactive from '../assets/inactiveNextButton.png'; // 비활성화된 버튼 이미지
import nextButtonActive from '../assets/nextButton.png'; // 활성화된 버튼 이미지

// 배경 데이터
const backgrounds = [
  { id: 1, name: '눈이 소복한 숲속', image: require('../assets/background/forest1.png') },
  { id: 2, name: '신비로운 숲속', image: require('../assets/background/forest2.png') },
  { id: 3, name: '신비로운 궁전', image: require('../assets/background/palace1.png') },
  { id: 4, name: '알록달록한 궁전', image: require('../assets/background/palace2.png') },
  { id: 5, name: '푸른 바다의 전설', image: require('../assets/background/under-the-sea1.png') },
  { id: 6, name: '니모가 헤엄치는 바다', image: require('../assets/background/under-the-sea2.png') },
  { id: 7, name: '상상 속 바다', image: require('../assets/background/under-the-sea3.png') },
  { id: 8, name: '눈이 내리는 마을', image: require('../assets/background/village1.png') },
  { id: 9, name: '이상한 골목길', image: require('../assets/background/village2.png') },
  { id: 10, name: '보물이 숨겨진 해변', image: require('../assets/background/village3.png') },
];

// 랜덤으로 10개의 배경을 뽑는 함수
const getRandomBackgrounds = () => {
  const shuffled = backgrounds.sort(() => 0.5 - Math.random()); // 배열을 랜덤으로 섞기
  return shuffled.slice(0, 10); // 10개만 선택
};

// 카드 데이터 (랜덤 배경들)
const cardData = getRandomBackgrounds().map((background, index) => ({
  id: index + 1,
  image: background.image,
  backgroundId: background.id,
}));

const SetBackground = ({ setSelectedBackgrounds }) => {
  const [selectedCards, setSelectedCards] = useState([]); // 선택된 카드들
  const [selectedCardIds, setSelectedCardIds] = useState([]); // 선택된 배경 ID들
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const handleCardClick = (cardId, backgroundId) => {
    if (selectedCardIds.includes(backgroundId)) {
      // 이미 선택된 배경이라면 선택 취소
      setSelectedCards([]);
      setSelectedCardIds([]);
    } else {
      // 배경 하나만 선택 가능
      setSelectedCards([cardId]);
      setSelectedCardIds([backgroundId]);
    }
  };

  const handleNextPage = () => {
    if (selectedCards.length === 0) {
      alert('배경을 최소 1개 선택해야 합니다.');
    } else {
      // 선택된 배경 정보 출력
      const selectedBackground = backgrounds.filter(background =>
        selectedCardIds.includes(background.id)
      );

      setSelectedBackgrounds(selectedBackground); // 부모로 선택된 배경 전달
      navigate('/length'); // SetLength 페이지로 이동
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
      <div className="main-title">배경 선택</div>

      {/* 카드 슬라이더 */}
      <div className="card-slider" aria-label="카드 슬라이더">
        {cardData.map((item) => (
          <div
            key={item.id}
            className={`card ${selectedCards.includes(item.id) ? 'active' : ''}`}
            role="button"
            tabIndex="0"
            aria-label={`카드 ${item.id}`}
            onClick={() => handleCardClick(item.id, item.backgroundId)}
          >
            <div className="inner-card">
              {selectedCards.includes(item.id) && (
                <img src={item.image} alt={`background-${item.backgroundId}`} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 선택된 카드 수 표시 */}
      <div className="selected-count">
        선택된 카드 수: {selectedCards.length} / 1
      </div>

      {/* '다음 페이지로' 버튼 */}
      <div className="next-button-container">
        <img
          src={selectedCards.length > 0 ? nextButtonActive : nextButtonInactive}
          alt="Next Button"
          className={selectedCards.length > 0 ? 'nextButton' : 'inactiveNextButton'}
          onClick={selectedCards.length > 0 ? handleNextPage : undefined}
        />
      </div>
    </div>
  );
};

export default SetBackground;
