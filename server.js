const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs'); // 파일 저장을 위한 fs 모듈
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

  try {
    // 이야기 생성 요청
    const story = await generateStory(selectedCharacters, selectedBackgrounds, selectedLength);

    // 파일 경로 (여기서는 고정된 파일 이름 사용)
    const filePath = './stories/generated_story.txt';  // 파일명 고정

    // stories 폴더가 없으면 생성
    if (!fs.existsSync('./stories')) {
      fs.mkdirSync('./stories');
    }

    // 파일에 저장
    fs.writeFileSync(filePath, story, 'utf8');
    console.log(`이야기가 ${filePath}에 저장되었습니다.`);

    // 생성된 이야기와 파일 경로를 클라이언트로 전달
    res.json({ story, filePath });
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: '이야기 생성 중 오류가 발생했습니다.' });
  }
});

// 스토리 저장 엔드포인트
app.post('/save-story', (req, res) => {
  const { storyText, filePath } = req.body;

  if (!storyText || !filePath) {
    return res.status(400).json({ error: '스토리와 파일 경로가 필요합니다.' });
  }

  try {
    // 기존 이야기 파일에 덧붙이기
    fs.appendFileSync(filePath, `\n\n사용자 추가 내용:\n${storyText}\n`);
    console.log(`사용자 입력이 ${filePath}에 덧붙여졌습니다.`);

    res.json({ message: '스토리가 덧붙여졌습니다.', filePath });
  } catch (error) {
    console.error('파일 덧붙이기 중 오류 발생:', error);
    res.status(500).json({ error: '스토리 덧붙이기 중 오류가 발생했습니다.' });
  }
});

// 이야기 생성 함수
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
        { role: 'system', content: 'Please make the story in Korean. You are a children\'s story generator. Please make the beginning of the story. Your stories should be short, simple, and easy to understand. Please create only two sentences, based on periods. The tone of speech is that of a fairy tale aimed at children.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 120,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API 호출 중 에러 발생:', error);
    throw new Error('OpenAI API 호출 실패');
  }
}

// 이야기 이어서 생성하는 Tango 엔드포인트
app.post('/generate-story2', async (req, res) => {
  try {
    // 파일에서 기존 이야기 읽기
    const filePath = './stories/generated_story.txt';
    let previousStoryText = '';
    
    // 파일이 존재하면 읽기
    if (fs.existsSync(filePath)) {
      previousStoryText = fs.readFileSync(filePath, 'utf8');
    }

    // 기존 이야기와 이어서 새로운 이야기 생성
    const generatedStory2 = await generateNextStory(previousStoryText);  // 기존 이야기 텍스트를 넘겨받아서 이어서 이야기 생성

    // 생성된 새로운 이야기 반환
    res.json({ generatedStory2 });
  } catch (error) {
    console.error('Error generating next story:', error);
    res.status(500).json({ error: '새로운 이야기 생성 중 오류가 발생했습니다.' });
  }
});

// 기존 이야기와 이어서 새로운 이야기 생성
async function generateNextStory(previousStoryText) {
  try {
    const prompt = `이야기를 이어서 생성하세요. 기존 이야기: "${previousStoryText}"`;

    // OpenAI GPT-3 API 요청
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a children\'s story generator. Please continue the following story. Please create only two sentences, based on periods.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 120,
    });

    const generatedStory = response.choices[0].message.content;

    // 생성된 새로운 이야기 덧붙이기
    const filePath = './stories/generated_story.txt';
    fs.appendFileSync(filePath, `\n\n${generatedStory}\n`); // 새로운 이야기를 파일에 덧붙임

    return generatedStory;
  } catch (error) {
    console.error('OpenAI API 호출 중 에러 발생:', error);
    throw new Error('OpenAI API 호출 실패');
  }
}



// 맞춤법 수정 엔드포인트
app.post('/correct-text', async (req, res) => {
  const { text } = req.body; // 클라이언트에서 전달된 텍스트

  if (!text) {
    return res.status(400).json({ error: 'Text is required.' });
  }

  try {
    // 맞춤법 및 문법 수정 요청
    const correctedText = await correctText(text);
    res.json({ correctedText });
  } catch (error) {
    console.error('Error correcting text:', error);
    res.status(500).json({ error: '맞춤법 수정 중 오류가 발생했습니다.' });
  }
});

// 맞춤법 수정 함수
async function correctText(text) {
  try {
    const prompt = `"${text}"`;

    // OpenAI GPT-3 API 호출하여 맞춤법과 문법을 수정
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: "system",
          content: "You are a helpful assistant who only corrects spelling and grammar mistakes in the text, without changing the meaning or intent of the message." },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200, // 응답의 최대 토큰 수
    });

    // 수정된 텍스트 반환
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
