
// node --version # Should be >= 18
// npm install @google/generative-ai

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
  
  const MODEL_NAME = import.meta.env.VITE_MODEL_NAME;
  const API_KEY = import.meta.env.VITE_GEMINI_API;
  
  async function runChat(prompt, history = []) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    
    const chatHistory = history.map((item) => {
      const parts = item.result.map((r) => {
        if (r.language && r.code) {
          return {
            text: `\`\`\`${r.language}\n${r.code}\n\`\`\``, // Code block with language identifier
          };
        } else {
          return { text: r.description }; // Text response
        }
      });
  
      return {
        prompt: item.prompt,
        parts: parts,
      };
    });
    
    console.log(chatHistory);
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
  
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    return response.text();
  }
  
  export default runChat;