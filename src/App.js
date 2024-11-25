import React, { useState } from 'react';  // useState를 React에서 임포트
import './App.css';  // App.css는 전역 스타일을 관리하는 파일
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // React Router 추가
import MainPage from './components/MainPage';  // MainPage 컴포넌트 import
import SetCharacter from './components/SetCharacter'; 
import SetBackground from './components/SetBackground'; 
import SetLength from './components/SetLength'; 
import Story from './components/Story'; 
import Making from './components/Making'; 
// src/index.js 또는 src/App.js에 추가
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [selectedBackgrounds, setSelectedBackgrounds] = useState(null);
  const [selectedLength, setSelectedLength] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/character"
            element={<SetCharacter setSelectedCharacters={setSelectedCharacters} />}
          />
          <Route
            path="/background"
            element={<SetBackground setSelectedBackgrounds={setSelectedBackgrounds} />}
          />
          <Route
            path="/length"
            element={<SetLength setSelectedLength={setSelectedLength} />}
          />
          <Route
            path="/story"
            element={
              <Story
                selectedCharacters={selectedCharacters}
                selectedBackgrounds={selectedBackgrounds}
                selectedLength={selectedLength}
              />
            }
          />
          <Route path="/making" element={<Making />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
