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
  const [codeData, setcodeData] = useState([]);
  const [codeDesc, setDesc] = useState([]);
  const delayText = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => [prev + nextWord]);
    }, 25 * index);
  };
  const newChat = () => {
    setLoading(false);
    setShowResults(false);
  };
  const onSent = async (prompt) => {
    setcodeData([]);
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
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    // Matches CodeBlock work
    if (newResponse.includes("```")) {
      const regex = /```\w+\n(.*?\n)```/gs;
      const matches = [...newResponse.matchAll(regex)];
      const codeBlocks = matches
        .map((match) => match[1])
        .filter((item) => item !== "");
      setcodeData(codeBlocks);
      let newResponses = newResponse.split("*").join("<br/>");
      const descriptions = extractDescriptions(newResponses, codeBlocks);
      const codewithDesc = codeBlocks.map((code, index) => ({
        code,
        description: descriptions[index].description,
        language: descriptions[index].language,
      }));
      setDesc(codewithDesc);
      // response.split("*").join("<br>");
    }
    let newResponses = newResponse.split("*").join("<br/>");
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
    codeDesc,
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
// eslint-disable-next-line no-unused-vars
function extractDescriptions(text, codeBlocks) {
  const descriptions = [];
  const regex = /(?:(.*?)\s*)?```(\w+)\n(.*?\n)```(?:\s*\((.*?)\))?/gs;
  const matches = [...text.matchAll(regex)];
  matches.forEach((match) => {
    const before = match[1]?.trim();
    const language = match[2]?.trim();
    // const code = match[3];
    const after = match[3]?.trim();
    const description = before || after || ""; // Use before, after, or empty string
    descriptions.push({ description, language });
  });
  return descriptions;
}
export default ContextProvider;
