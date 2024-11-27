import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Making.css';
import placeholderImage from '../assets/background.png';
import StartBtn from '../assets/StartBtn.png';
import StopBtn from '../assets/StopBtn.png';
import Rerecord from '../assets/Rerecord.png';
import nextButtonActive from '../assets/nextButton.png'; // 활성화된 Next 버튼 이미지
import nextButtonInactive from '../assets/inactiveNextButton.png'; // 비활성화된 Next 버튼 이미지
import finishButtonInactive from '../assets/inactiveFinishButton.png'; // 비활성화된 완료 버튼 이미지
import finishButtonActive from '../assets/finishButton.png'; // 활성화된 완료 버튼 이미지
import { useRef } from 'react'; // 추가

import axios from 'axios'; // axios import

const Making = ({ selectedCharacters, selectedBackgrounds, selectedLength }) => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태 관리
  const [storyText, setStoryText] = useState("녹음 버튼을 눌러 다음에 올 문장을 녹음하세요!"); // 텍스트 상태 관리
  const [generatedStory, setGeneratedStory] = useState(""); // 생성된 이야기 상태 관리
  const [isFinished, setIsFinished] = useState(false); // 완료 버튼 상태 관리
  const [isNextEnabled, setIsNextEnabled] = useState(false); // Next 버튼 활성화 상태 관리
  const [storyFilePath, setStoryFilePath] = useState(""); // 파일 경로 상태 관리
  const [isStoryGenerated, setIsStoryGenerated] = useState(false); // 이야기 생성 여부 상태 관리

  const hasRequestedStory = useRef(false); // 요청 여부를 추적하는 useRef

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  // recognition 객체를 useMemo로 감싸서 메모이제이션
  const recognition = useMemo(() => {
    return SpeechRecognition ? new SpeechRecognition() : null;
  }, [SpeechRecognition]);

  // 음성 인식 초기화와 오류 핸들링을 위해 useEffect 수정
  useEffect(() => {
    if (recognition) {
      recognition.lang = 'ko-KR';
      recognition.interimResults = true;

      recognition.onstart = () => {
        console.log('음성 인식이 시작되었습니다.');
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        setStoryText(finalTranscript);
      };

      recognition.onerror = (event) => {
        console.error('음성 인식 오류:', event.error);
      };
    }

    // cleanup: 음성 인식 종료
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  // 생성된 이야기를 서버에서 받아오는 함수 (useCallback을 사용해 재사용 가능하도록 변경)
  const generateStory = useCallback(async () => {
    try {
      console.log('서버로 선택값 전송:', { selectedCharacters, selectedBackgrounds, selectedLength });

      // 중복 요청을 방지하기 위해 이미 요청했는지 체크
      if (hasRequestedStory.current) {
        return; // 요청이 이미 진행 중이면 아무 작업도 하지 않음
      }

      hasRequestedStory.current = true; // 요청이 시작되었음을 표시

      const response = await axios.post('http://localhost:5000/generate-story', {
        selectedCharacters,
        selectedBackgrounds,
        selectedLength,
      });

      // 생성된 이야기와 파일 경로 받기
      setGeneratedStory(response.data.story);
      setStoryFilePath(response.data.filePath); // 파일 경로 저장
      setIsStoryGenerated(true); // 이야기 생성 완료 상태 설정
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      hasRequestedStory.current = false; // 요청이 끝났음을 표시
    }
  }, [selectedCharacters, selectedBackgrounds, selectedLength]);

  // generateStory가 중복 호출되지 않도록 수정
  useEffect(() => {
    // isStoryGenerated가 false일 때만 generateStory 호출
    if (!isStoryGenerated) {
      generateStory();
    }
  }, [generateStory, isStoryGenerated]);

  const handleNextClick = () => {
    navigate('/tango', { state: { storyText, generatedStory } });
  };

  const handleAudioButtonClick = () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsRecording(!isRecording);
  };

  const handleRerecordClick = () => {
    setIsRecording(false);
    setStoryText("녹음 버튼을 눌러 다음에 올 문장을 녹음해요!");
    recognition.stop();
    setIsFinished(false);
    setIsNextEnabled(false);
  };

  const handleFinishClick = () => {
    setIsFinished(true); // 완료 상태로 전환
    setIsNextEnabled(true); // Next 버튼 활성화

    // 사용자가 입력한 내용을 서버로 전송하여 파일에 덧붙이기
    if (storyText && storyFilePath) {
      axios.post('http://localhost:5000/save-story', {
        storyText,
        filePath: storyFilePath,
      })
      .then(response => {
        console.log('사용자 입력이 덧붙여졌습니다:', response.data.filePath);
      })
      .catch(error => {
        console.error('스토리 덧붙이기 중 오류 발생:', error);
      });
    }
  };

  return (
    <div
      className="main-container"
      style={{ backgroundImage: `url(${placeholderImage})` }}
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
            onChange={(e) => setStoryText(e.target.value)}
            placeholder="녹음 버튼을 눌러 다음에 올 문장을 녹음해요!"
          />
        </div>

        {/* Finish Button */}
        <div className="fin-record-button-container">
          <img
            src={isFinished ? finishButtonActive : finishButtonInactive}
            alt="Finish Button"
            onClick={!isFinished ? handleFinishClick : undefined}
          />
        </div>

        {/* Rerecord Button */}
        <div className="Rerecord-button-container">
          <img
            src={Rerecord}
            alt="Rerecord Button"
            onClick={handleRerecordClick}
          />
        </div>
      </div>

      {/* Audio Button */}
      {!isFinished && (
        <div className="audio-button-container">
          <img
            src={isRecording ? StopBtn : StartBtn}
            alt={isRecording ? 'Stop Button' : 'Start Button'}
            onClick={handleAudioButtonClick}
          />
        </div>
      )}

      {/* Next Button */}
      {isFinished && (
        <div className="nextzz-button-container">
          <img
            src={isNextEnabled ? nextButtonActive : nextButtonInactive}
            alt="Next Button"
            onClick={isNextEnabled ? handleNextClick : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default Making;
