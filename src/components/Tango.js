import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // useLocation, useNavigate 임포트
import '../styles/Making.css';
import '../styles/Tango.css';
import placeholderImage from '../assets/background.png';
import nextButtonActive from '../assets/nextButton.png'; // 활성화된 Next 버튼 이미지

const Tango = () => {
    const location = useLocation(); // 이전 페이지에서 전달된 데이터를 가져옴
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 선언
    const { storyText = "No story text provided" } = location.state || {}; // 기본값 설정
  
    const [correctedText, setCorrectedText] = useState(""); // 수정된 텍스트를 저장할 상태
    const [generatedStory2, setGeneratedStory2] = useState(""); // 이어서 생성된 이야기
  
    const hasRequestedCorrection = useRef(false); // 맞춤법 수정 요청 추적
    const hasRequestedGeneration = useRef(false); // 이어서 이야기 생성 요청 추적

    // 맞춤법 수정 요청
    useEffect(() => {
        if (storyText && !hasRequestedCorrection.current) {
            hasRequestedCorrection.current = true; // 요청 진행 중
            fetch('http://localhost:5000/correct-text', { // 서버 URL 수정
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: storyText }),
            })
            .then(response => response.json())
            .then(data => {
                setCorrectedText(data.correctedText); // 수정된 텍스트를 상태에 저장
            })
            .catch(error => {
                console.error("Error correcting text:", error);
                setCorrectedText(storyText); // 오류 발생 시 원본 텍스트 그대로 사용
            })
            .finally(() => {
                hasRequestedCorrection.current = false; // 요청 완료
            });
        }
    }, [storyText]); // storyText가 변경될 때마다 맞춤법 수정 실행

    // 수정된 텍스트가 있다면 그걸 storyText로 덮어쓰기
    const displayedText = correctedText || storyText;

    // 이어서 이야기 생성하기
    useEffect(() => {
        if (storyText && !hasRequestedGeneration.current) {
            hasRequestedGeneration.current = true; // 요청 진행 중
            fetch('http://localhost:5000/generate-story2', { // 서버의 generate-story2 엔드포인트 호출
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ previousStoryText: storyText }), // 기존 이야기를 서버로 전달
            })
            .then(response => response.json())
            .then(data => {
                setGeneratedStory2(data.generatedStory2); // 이어서 생성된 이야기 저장
            })
            .catch(error => {
                console.error("Error generating next story:", error);
            })
            .finally(() => {
                hasRequestedGeneration.current = false; // 요청 완료
            });
        }
    }, [storyText]); // storyText가 변경될 때마다 이어서 이야기 생성

    const handleClick = () => {
        navigate('/fin');  // 버튼 클릭 시 fin 경로로 이동
    };

    // 버튼 활성화 여부 판단
    const isNextButtonActive = generatedStory2 && generatedStory2.trim() !== "";

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
            <div className="main-title">AI와 함께</div>

            <div className="story-container">
                <div className="overlay" />
                {/* 전달된 이야기 텍스트 표시 */}
                <div className="story-text">
                    <p>{displayedText}</p>
                </div>
                <div className="white-box">
                    <p className="white-box-text">
                        {generatedStory2 || "AI가 이어서 이야기를 생성 중이에요.."}
                    </p>
                </div>
            </div>

            {/* Next Button: generatedStory2가 생성되었을 때만 보이도록 조건부 렌더링 */}
            {isNextButtonActive && (
                <div className="next22-button-container">
                    <img
                        src={nextButtonActive}
                        alt="Next Button"
                        className="nextButton-blinking-button"
                        onClick={handleClick} // 클릭 시 페이지 이동
                    />
                </div>
            )}
        </div>
    );
};

export default Tango;
