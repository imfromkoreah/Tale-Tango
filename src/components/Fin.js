import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import
import '../styles/MainPage.css'; // 스타일 파일 import
import placeholderImage from '../assets/background.png';  // 기본 이미지 import

// assets/storybook/에 있는 6개의 이미지 import
import image1 from '../assets/storybook/storybook1.png';
import image2 from '../assets/storybook/storybook2.png';
import image3 from '../assets/storybook/storybook3.png';
import image4 from '../assets/storybook/storybook4.png';
import image5 from '../assets/storybook/storybook5.png';
import image6 from '../assets/storybook/storybook6.png';

const Fin = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
  const [selectedImage, setSelectedImage] = useState('');  // 선택된 이미지 상태 관리
  const [inputText, setInputText] = useState('');  // 카드에 입력된 텍스트 상태 관리

  // 이미지 선택 처리
  const handleImageClick = (image) => {
    setSelectedImage(image);  // 선택된 이미지 업데이트
  };

  // 텍스트 입력 처리
  const handleTextChange = (event) => {
    setInputText(event.target.value);  // 텍스트 입력 업데이트
  };

  // 전송 버튼 클릭 시 처리
  const handleSubmit = () => {
    if (!inputText || !selectedImage) {
      alert('이야기 제목과 그림을 선택해주세요!');
      return;
    }
    // 전송 처리 (예: 데이터 저장 또는 다른 페이지로 이동 등)
    console.log('선택된 이미지:', selectedImage);
    console.log('입력된 제목:', inputText);
    navigate('/');  // 예시로 홈 페이지로 이동
  };

  return (
    <div
      className="main-container"
      style={{
        backgroundImage: `url(${placeholderImage})`, // 기본 배경 이미지
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="main-title">표지를 고르자</div>

      {/* 이미지 선택 영역 */}
      <div style={{ width: 1366, height: 1024, position: 'relative' }}>
        <div style={{ position: 'absolute', top: '200px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
          {[image1, image2, image3, image4, image5, image6].map((image, index) => (
            <div
              key={index}
              style={{ cursor: 'pointer' }}
              onClick={() => handleImageClick(image)} // 이미지 클릭 시 선택
            >
              <img src={image} alt={`storybook ${index}`} style={{ width: 150, height: 150, borderRadius: 15 }} />
            </div>
          ))}
        </div>

        {/* 선택된 이미지로 배경 설정 */}
        {selectedImage && (
          <div
            style={{
              width: 350,
              height: 452,
              position: 'absolute',
              top: '380px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundImage: `url(${selectedImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 15,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* 텍스트 입력 영역 */}
            <input
              type="text"
              value={inputText}
              onChange={handleTextChange}
              placeholder="이야기 제목을 지어줘"
              style={{
                width: '80%',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center',
                border: 'none',
                fontSize: '25px',
                backgroundColor: 'rgba(255, 255, 255, 1)',
              }}
            />
            
            {/* 전송 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={!inputText}  // 제목이 입력되지 않았으면 비활성화
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: inputText ? '#4CAF50' : '#E6E6E6',  // 제목 입력 시 활성화
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                cursor: inputText ? 'pointer' : 'not-allowed',  // 활성화/비활성화 상태에 따라 커서 변경
              }}
            >
              전송
            </button>
          </div>
        )}

        {/* 선택된 이미지가 없으면 기본 메시지 표시 */}
        {!selectedImage && (
          <div style={{ position: 'absolute', top: '600px', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '24px' }}>
            위에서 그림을 선택해주세요!
          </div>
        )}
      </div>
    </div>
  );
};

export default Fin;
