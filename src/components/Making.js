import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Making.css';
import placeholderImage from '../assets/background.png';
import StartBtn from '../assets/StartBtn.png';
import StopBtn from '../assets/StopBtn.png';
import Rerecord from '../assets/Rerecord.png';
import axios from 'axios'; // axios import

const Making = ({ selectedCharacters, selectedBackgrounds, selectedLength }) => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태 관리
  const [storyText, setStoryText] = useState("녹음 버튼을 눌러 녹음하세요!"); // 텍스트 상태 관리
  const [generatedStory, setGeneratedStory] = useState(""); // 생성된 이야기 상태 관리

  const handleNextClick = () => {
    navigate('/tango');
  };

  const handleAudioButtonClick = () => {
    setIsRecording(!isRecording); // 버튼 클릭 시 녹음 상태 변경
  };

  const handleTextChange = (e) => {
    setStoryText(e.target.value); // 텍스트가 수정될 때마다 상태 업데이트
  };

  const handleBlur = () => {
    // 포커스가 벗어날 때 텍스트 저장 (추후 API 연동이나 다른 처리가 필요하면 추가)
  };

  const handleRerecordClick = () => {
    setIsRecording(false); // 녹음 상태 초기화 (멈추기)
    setStoryText("녹음 버튼을 눌러 녹음하세요!"); // 텍스트 초기화
  };

  // 서버로 이야기 생성 요청 보내기
  const generateStory = async () => {
    console.log('서버로 선택값 전송:', {
      selectedCharacters,
      selectedBackgrounds,
      selectedLength,
    });
  
    try {
      const response = await axios.post('http://localhost:5000/generate-story', {
        selectedCharacters,
        selectedBackgrounds,
        selectedLength,
      });
      setGeneratedStory(response.data.story);
    } catch (error) {
      console.error('Error generating story:', error);
    }
  };

  // Automatically generate story when the component mounts
  useEffect(() => {
    generateStory(); // Call generateStory on page load
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div
      className="main-container"
      style={{
        backgroundImage: `url(${placeholderImage})`,
      }}
    >
      <div className="main-title">이야기 제작</div>

      <div className="story-container">
        <div className="overlay" />
        <div className="story-text">
          {generatedStory || "잠시만 기다려요..."} 
        </div>
        <div className="white-box">
          <textarea
            className="white-box-text"
            value={storyText}
            onChange={handleTextChange} // 텍스트 상태를 관리
            onBlur={handleBlur} // 포커스가 벗어날 때 저장
            placeholder="녹음 버튼을 눌러 녹음하세요!" // placeholder 텍스트
          />
        </div>

        {/* Generate Story Button */}
        <div className="generate-button-container">
          <button onClick={generateStory}>이야기 생성</button>
        </div>

        {/* Rerecord Button */}
        <div className="Rerecord-button-container">
          <img
            src={Rerecord} // Rerecord 버튼 이미지
            alt="Rerecord Button"
            onClick={handleRerecordClick} // 클릭 시 녹음 초기화 및 재시작
          />
        </div>
      </div>

      {/* Audio Button */}
      <div className="audio-button-container">
        <img
          src={isRecording ? StopBtn : StartBtn} // 녹음 상태에 따라 버튼 이미지 변경
          alt={isRecording ? 'Stop Button' : 'Start Button'}
          onClick={handleAudioButtonClick} // 클릭 시 녹음 시작/중지
        />
      </div>
    </div>
  );
};

export default Making;
