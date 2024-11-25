export const sendMessageToAI = async (message) => {
    const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    });

    const data = await response.json();
    if (data.response) {
        return data.response; // 응답 반환
    } else {
        throw new Error(data.error || 'Something went wrong');
    }
};
