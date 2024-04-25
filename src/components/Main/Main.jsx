/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import "./Main.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {
  const resultsEndRef = useRef(null);
  const handleCopy = (result) => {
    toast.success("Code copied to clipboard!");
  };

  const {
    newChat,
    onSent,
    recentPrompt,
    showResults,
    loading,
    result,
    setInput,
    input,
    promptsAndResults,
    setPromptsAndResults,
  } = useContext(Context);
  const filterDescription = (description) => {
    if (!description) return "";
    const regex = /<\/?(?!(b\b|br\b|\/b\b))[^>]*?>/g;
    return description.replace(regex, (match) => {
      return match.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // Replace < and >
    });

  };

  const clickCard = (e) => {
    const card = e.currentTarget;
    const promptText = card.querySelector("p").textContent;
    onSent(promptText);
  };
  useEffect(() => {
    if (recentPrompt.length > 0 && result.length > 0) {
      const newEntry = { prompt: recentPrompt, result };
      setPromptsAndResults([...promptsAndResults, newEntry]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentPrompt, result]);
  const scrollToBottom = () => {
    resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showResults) {
      scrollToBottom();
    }
  }, [promptsAndResults, showResults]);
  return (
    <div className="main">
      <div className="nav">
        <p onClick={() => newChat()}>Zallo</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        <ToastContainer />
        {!showResults ? (
          <>
            <div className="greet">
              <p>
                <span>Greetings, There.</span>
              </p>
              <p>How can i help you today?</p>
            </div>
            <div className="cards">
              <div className="card" onClick={clickCard}>
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card" onClick={clickCard}>
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card" onClick={clickCard}>
                <p>Brainstrom team bonding Activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card" onClick={clickCard}>
                <p>Write hello world in 6 programming languages</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            {loading ? (
              <div className="loader"></div>
            ) : (
              <>
                {promptsAndResults.map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="result-title" key={index}>
                      <p dangerouslySetInnerHTML={{ __html: item.prompt }}></p>
                      <img src={assets.user_icon} alt="" />
                    </div>
                    <div className="result-data">
                      <div className="img">
                        <img src={assets.robot} alt="" />
                      </div>
                      <div className="result-here">
                        {item.result.map((item, index) => (
                          <div className="code-result" key={index}>
                            {item.language && item.code ? (
                              <>
                                {item.description && (
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html: filterDescription(item.description),
                                    }}
                                  ></p>
                                )}
                                <CopyToClipboard
                                  key={index}
                                  text={item.code}
                                  onCopy={() => handleCopy(result)}
                                >
                                  <div style={{ width: "100%" }}>
                                    <SyntaxHighlighter
                                      language={item.language}
                                      style={monokaiSublime}
                                      showLineNumbers
                                    >
                                      {item.code}
                                    </SyntaxHighlighter>
                                  </div>
                                </CopyToClipboard>
                              </>
                            ) : (
                              <>
                                {item.description && (
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html: filterDescription(item.description),
                                    }}
                                  ></p>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div ref={resultsEndRef} />
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => {
                setInput(e.target.value);
              }}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
              onKeyPress={(e) => {
                if (e.key === "Enter" && input !== null && input !== "") {
                  onSent();
                }
              }}
            />
            <div>
              {input ? (
                <img
                  onClick={() => {
                    onSent();
                  }}
                  src={assets.send_icon}
                  alt=""
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
