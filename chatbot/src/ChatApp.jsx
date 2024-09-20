import React, { useState } from 'react';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: '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', dangerouslyAllowBrowser: true });

const fakeResponses = {
    "hi": "Hello! How can I assist you today?",
    "tell me a joke": "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "explain the importance of fast language models": "Fast language models can significantly improve the user experience by providing quick responses, which is essential for applications that require real-time interaction."
};

const ChatApp = () => {
    const [userInput, setUserInput] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [useFakeResponses, setUseFakeResponses] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAiResponse('Loading...');

        if (useFakeResponses) {
            setAiResponse(fakeResponses[userInput.toLowerCase()] || "I'm not sure how to respond to that.");
            return;
        }

        try {
            const response = await groq.chat.completions.create({
                messages: [{ role: 'user', content: userInput }],
                model: 'llama3-8b-8192',
            });

            setAiResponse(response.choices[0]?.message?.content || 'No response');
        } catch (error) {
            console.error('Error:', error);
            setAiResponse('Error fetching response.');
        }
    };

    return (
        <div className="chat-container">
            <h1>Chat with AI</h1>
            <label>
                <input
                    type="checkbox"
                    checked={useFakeResponses}
                    onChange={() => setUseFakeResponses(!useFakeResponses)}
                />
                Use Fake Responses
            </label>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message here"
                    required
                />
                <button type="submit">Send</button>
            </form>
            <div className="response-container">
                <h2>Response:</h2>
                <p>{aiResponse}</p>
            </div>
        </div>
    );
};

export default ChatApp;
