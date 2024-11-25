import React from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigate import
import '../styles/MainPage.css'; // MainPage 스타일 파일을 상대 경로로 import
import placeholderImage from '../assets/background.png';  // 이미지 import

const MainPage = () => {
  const navigate = useNavigate();  // navigate 훅을 사용하여 페이지 이동
  
  const handleClick = () => {
    navigate('/character');  // 버튼 클릭 시 /story 경로로 이동
  };

  return (
    <div 
      className="main-container"
      style={{ 
        backgroundImage: `url(${placeholderImage})`,  // import한 이미지를 URL로 사용
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >

      {/* Main Title */}
      <div className="main-title">테일탱고</div>
    </div>
  );
};

export default MainPage;
