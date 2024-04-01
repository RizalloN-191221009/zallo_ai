import { createContext, useState } from "react";
import runChat from "../config/Zallo";
import PropTypes from "prop-types";

export const Context = createContext();
const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [codeData, setCodeData] = useState("");
  const delayText = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 25 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResults(false);
  };
  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResults(true);
    let response = "";
    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }
    let codeResponse = ''; // Initialize codeResponse

  // Check if response contains code block
    if (response.includes('```')) {
      // Extract code block and language identifier
      const codeBlockMatch = response.match(/```([\s\S]*?)\n([\s\S]*?)\n```/);
      const language = codeBlockMatch ? codeBlockMatch[1] : 'javascript';
      const codeValue = codeBlockMatch ? codeBlockMatch[2] : '';

      // Set codeResponse with code block and syntax highlighting
      setCodeData(`\`\`\` ${language}\n${codeValue}\n\`\`\``);
    } else {
      // Handle response without code block
      codeResponse = response;
    }

    let responseArray = codeResponse.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    
    let newResponses = newResponse.split("*").join("</br>");
    let newResponseArray = newResponses.split(" ");

    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayText(i, nextWord + " ");
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
    resultData,
    codeData,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ContextProvider;
