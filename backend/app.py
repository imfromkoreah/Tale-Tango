from flask import Flask, request, jsonify
import openai
import os
from dotenv import load_dotenv  # python-dotenv 추가

# .env 파일의 환경 변수 로드
load_dotenv()

app = Flask(__name__)

# OpenAI API 키 설정 (환경 변수에서 가져오기)
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("message")
    if not user_input:
        return jsonify({"error": "No message provided"}), 400
    
    try:
        # OpenAI API 호출
        response = openai.Completion.create(
            engine="text-davinci-003",  # 사용할 모델
            prompt=user_input,
            max_tokens=150
        )
        
        # OpenAI의 응답 반환
        return jsonify({"response": response.choices[0].text.strip()})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
