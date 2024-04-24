// node --version # Should be >= 18
// npm install @google/generative-ai
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
const MODEL_NAME = import.meta.env.VITE_MODEL_NAME;
const API_KEY = import.meta.env.VITE_GEMINI_API;
let chatHistory = [];
let previousPrompt = '';
async function runChat(prompt) {
  if (prompt === previousPrompt) {
    return;
  }
  previousPrompt = prompt;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];
 
  
  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: chatHistory,
  });
  // console.log(chat); // Use JSON.stringify for formatting
  const result = await chat.sendMessage(prompt);
  const response = result.response;
  const isDuplicate = chatHistory.some((entry) => {
    if (entry.role === "user" && entry.parts[0].text === prompt) {
      return true;
    }
    if (entry.role === "model" && entry.parts[0].text === response.text()) {
      return true;
    }
    return false;
  });
  if (!isDuplicate) {
  chatHistory = [...chatHistory,
    { role: "user", parts: [{ text: prompt }] }, 
    { role: "model", parts: [{ text: response.text() }] }
  ]}
  return response.text();
}
export default runChat;
