import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/MainPage.css';
import placeholderImage from '../assets/background.png';

const Restart = () => {
  const location = useLocation();
  const { selectedImage, storyText, inputText } = location.state || {};  // state에서 selectedImage, storyText, inputText 가져오기

  const [showStory, setShowStory] = useState(false);

  const handleTicketClick = () => {
    setShowStory(!showStory); // 클릭 시 storyText 보여주기/숨기기 토글
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
      <div className="main-title">이야기 티켓</div>

      <div className="story-planet" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {/* 티켓 */}
        <div
          className="ticket"
          onClick={handleTicketClick}
          style={{
            width: '350px',
            height: '490px',
            borderRadius: '15px',
            cursor: 'pointer',
            position: 'relative',
            transformStyle: 'preserve-3d',  // 3D 회전을 위한 스타일
            transition: 'transform 1s',  // 회전 애니메이션
            transform: showStory ? 'rotateY(180deg)' : 'rotateY(0deg)',  // 클릭 시 180도 회전
            transformOrigin: 'center', // 회전 중심
          }}
        >
          {/* 앞면 (표지 이미지) */}
          <div
            style={{
              backgroundImage: `url(${selectedImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
              borderRadius: '15px',
              position: 'absolute',
              backfaceVisibility: 'hidden', // 뒷면이 보이지 않도록 설정
            }}
          >
            <div
              style={{
                fontSize: '25px',
                color: 'white',
                textAlign: 'center',
                position: 'absolute',
                bottom: '20px',
                width: '100%',
                fontWeight: 'bold',
              }}
            >
              {inputText ? inputText : '이야기 제목 없음'}
            </div>
          </div>

          {/* 뒷면 (이야기 텍스트) */}
          {storyText && (
            <div
              style={{
                width: '100%',
                height: '100%',
                fontSize: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '20px',
                whiteSpace: 'pre-wrap',  // 줄바꿈 처리
                borderRadius: '15px',
                position: 'absolute',
                backfaceVisibility: 'hidden', // 뒷면이 보이지 않도록 설정
                transform: 'rotateY(180deg)',  // 180도 회전된 상태로 배치
                display: showStory ? 'block' : 'none',  // storyText가 보일 때만 뒷면을 표시
              }}
            >
              <h3>저장된 이야기</h3>
              <p>{storyText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restart;
