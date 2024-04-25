import { createContext, useState } from "react";
import runChat, {resetChatHistory } from "../config/Zallo";
import PropTypes from "prop-types";

export const Context = createContext();
const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [promptsAndResults, setPromptsAndResults] = useState([]);

  const newChat = () => {
    setLoading(false);
    setShowResults(false);
    setPrevPrompts([]);
    setRecentPrompt([]);
    setPromptsAndResults([]);
    resetChatHistory();
  };
  const onSent = async (prompt) => {
    setRecentPrompt([]);
    setResult([]);
    setLoading(true);
    setShowResults(true);
    let response = "";
    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt((data) => [...data, prompt]);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt((data) => [...data, input]);
      response = await runChat(input);
    }
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    
    if (newResponse.includes("```")) {
      let newResponses = newResponse.split("*").join("<br/>");
      const descriptions = extractDescriptions(newResponses);
      setResult(descriptions);
    } else {
      let newResponses = newResponse.split("*").join("<br/>");
      setResult([{ description: newResponses, language: null, code: null }]);
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    input,
    setInput,
    showResults,
    loading,
    result,
    newChat,
    promptsAndResults,
    setPromptsAndResults,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
// eslint-disable-next-line no-unused-vars
function extractDescriptions(text) {
  const descriptions = [];
  const regex = /(?:(.*?)\s*)?```(\w+)\n(.*?\n)```(?:\s*\((.*?)\))?/gs;
  const matches = [...text.matchAll(regex)];
  matches.forEach((match) => {
    const before = match[1]?.trim();
    const language = match[2]?.trim();
    const code = match[3];
    const after = match[4]?.trim();
    const description = before || after || "";
    descriptions.push({ description, language, code });
  });
  return descriptions;
}
export default ContextProvider;
