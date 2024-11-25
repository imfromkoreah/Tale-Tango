import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigate import
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
  const [storyText, setStoryText] = useState('');  // 저장된 이야기 텍스트

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
    // selectedImage와 inputText를 navigate를 통해 Restart로 전달
    navigate('/restart', { state: { selectedImage, storyText, inputText } });  // state로 selectedImage와 inputText 전달
  };

  // 컴포넌트가 마운트될 때 서버에서 이야기 텍스트 가져오기
  useEffect(() => {
    fetch('http://localhost:5000/get-story')  // 서버에서 txt 파일 가져오기
      .then((response) => response.json())
      .then((data) => {
        if (data.storyText) {
          setStoryText(data.storyText);  // 파일 내용 저장
        }
      })
      .catch((error) => {
        console.error('Error fetching story:', error);
      });
  }, []);

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

        {/* 이미지와 이야기 텍스트를 담을 컨테이너 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: '380px',
            left: '50%',
            transform: 'translateX(-50%)',
            gap: '20px', // 이미지와 텍스트 사이의 간격
          }}
        >
          {/* 선택된 이미지로 배경 설정 */}
          {selectedImage && (
            <div
              style={{
                width: 350,
                height: 490,
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

          {/* 이야기 텍스트 표시 영역 */}
          {storyText && (
            <div
              style={{
                width: '350px',
                height: '452px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',  // 불투명 배경
                borderRadius: '15px',
                padding: '20px',
                color: 'white',
                overflow: 'auto',
                fontSize: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                whiteSpace: 'pre-wrap',  // 줄바꿈 처리
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

export default Fin;
