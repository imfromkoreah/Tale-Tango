const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
require('dotenv').config(); // .env 파일에서 API 키를 로드

const app = express();
const port = 5000;

// CORS 설정
app.use(cors());

// Body parsing 설정 (JSON 형식의 요청 처리)
app.use(bodyParser.json());

// OpenAI 클라이언트 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // .env 파일에서 API 키를 로드
});

// 기본 루트
app.get('/', (req, res) => {
  res.send('AI 이야기 생성 서버');
});

// AI 이야기 생성 엔드포인트
app.post('/generate-story', async (req, res) => {
  const { selectedCharacters, selectedBackgrounds, selectedLength } = req.body;

  // 선택된 데이터 로깅 (디버깅용)
  console.log('선택된 등장인물:', selectedCharacters);
  console.log('선택된 배경:', selectedBackgrounds);
  console.log('선택된 이야기 길이:', selectedLength);

  try {
    // 이야기 생성 요청
    const story = await generateStory(selectedCharacters, selectedBackgrounds, selectedLength);
    res.json({ story });
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: '이야기 생성 중 오류가 발생했습니다.' });
  }
});

async function generateStory(characters, backgrounds, length) {
    try {
      // 등장인물과 배경에 대한 간단한 설정
      let prompt = `이야기 길이: ${length}. 등장인물: ${characters.map(c => c.name).join('와/과 ')}. 배경: ${backgrounds[0].name}. \n`;
  
      // 동화 스타일로 간단하게 이야기 생성
      if (length === 'len1') {
        // 짧고 간단한 이야기
        prompt += `${characters[0].name}와 ${characters[1].name}는 ${backgrounds[0].name}에서 만나 큰 모험을 시작했어요. 그들은 작은 문제를 해결하고 친구가 되었어요.`;
      } else if (length === 'len2') {
        // 중간 길이의 이야기
        prompt += `${characters[0].name}와 ${characters[1].name}는 ${backgrounds[0].name}에서 작은 모험을 떠났어요. 길을 걷다 보니 어려운 일이 생겼고, 그들은 함께 문제를 해결했어요.`;
      } else if (length === 'len3') {
        // 긴 이야기
        prompt += `${characters[0].name}와 ${characters[1].name}는 ${backgrounds[0].name}에서 큰 모험을 시작했어요. 그들은 여러 가지 어려움을 겪었지만, 결국 모두 함께 문제를 해결하고 행복하게 살았답니다.`;
      }
  
      // OpenAI GPT-3 API 요청
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a children\'s story generator. Your stories should be short, simple, and easy to understand.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 100,  // 짧은 동화를 위해 토큰 수를 제한
        
      });
  
      return response.choices[0].message.content;
  
    } catch (error) {
      console.error('OpenAI API 호출 중 에러 발생:', error);
      throw new Error('OpenAI API 호출 실패');
    }
  }
  
  
  
  

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
