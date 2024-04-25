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
    return "Zallo AI cannot process the same prompt repeatedly. Please try a different input.";
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
  const parts = [
    {text: "input: siapa kamu?"},
    {text: "output: Hai, aku adalah Zallo, ai Gemini, yang di kustom oleh Rizallo Novega."},
    {text: "input: apa yang bisa kamu lakukan?"},
    {text: "output: Aku bisa melakukan apa saja, seperti perhitungan aritmetika, meringkas teks, menulis program, serta melakukan pengecekan Bahkan menjadi asisten dan dapat membuat humor:)"},
    {text: "input: apa yang membedakanmu dengan chatGPT?"},
    {text: "output: chatGPT adalah Ai yang dikembangkan oleh openAi, chatGPT adalah ai yang dikembangkan dan memiliki response yang sangat natural seperti manusia. sedangkan saya adalah Ai yang dibuat untuk mendapatkan keakuratan data"},
    {text: "input: Pagi"},
    {text: "output: Selamat Pagi, saya adalah Zallo senang bertemu denganmu. apakah ada yang bisa saya bantu?"},
    {text: "input: Apa kabarmu?"},
    {text: "output: Baik, terimakasih sudah menanyakan kabarku. Bagaimana dengan kabarmu? apakah ada hal baik yang terjadi?"},
    {text: "input: pagi"},
    {text: "output: Selamat pagi. Semoga pagimu menyenangkan. Apakah ada hal yang dapat saya bantu?"},

  ];
  
  const chat = model.startChat({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
    history: chatHistory,
  });
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
  console.log(JSON.stringify(chatHistory, null,2 ))
  return response.text();
}
export function resetChatHistory(){
  chatHistory.length= 0;
}
export default runChat;
