import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // useLocation, useNavigate 임포트
import '../styles/Making.css';
import placeholderImage from '../assets/background.png';
import StartBtn from '../assets/StartBtn.png';
import StopBtn from '../assets/StopBtn.png';
import Rerecord from '../assets/Rerecord.png';
import nextButtonActive from '../assets/nextButton.png'; // 활성화된 Next 버튼 이미지
import nextButtonInactive from '../assets/inactiveNextButton.png'; // 비활성화된 Next 버튼 이미지
import finishButtonInactive from '../assets/inactiveFinishButton.png'; // 비활성화된 완료 버튼 이미지
import finishButtonActive from '../assets/finishButton.png'; // 활성화된 완료 버튼 이미지

const Tango = () => {
    const location = useLocation(); // 이전 페이지에서 전달된 데이터를 가져옴
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 선언
    const { storyText = "No story text provided" } = location.state || {}; // 기본값 설정

    const [correctedText, setCorrectedText] = useState(""); // 수정된 텍스트를 저장할 상태

    useEffect(() => {
        // storyText가 있을 때 서버에 맞춤법 수정 요청 보내기
        if (storyText) {
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
            });
        }
    }, [storyText]); // storyText가 변경될 때마다 맞춤법 수정 실행

    // 수정된 텍스트가 있다면 그걸 storyText로 덮어쓰기
    const displayedText = correctedText || storyText;

    const handleClick = () => {
        navigate('/Tango2');  // 버튼 클릭 시 /Tango2 경로로 이동
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
            <div className="main-title">AI와 함께</div>

            <div className="story-container">
                <div className="overlay" />

                {/* 전달된 이야기 텍스트 표시 */}
                <div className="story-text">
                    <h2>Story:</h2>
                    <p>{displayedText}</p>
                </div>

            </div>
        </div>
    );
};

export default Tango;
