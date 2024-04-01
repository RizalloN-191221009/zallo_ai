/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import "./Main.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {
  const handleCopy = (codeData) => {
    toast.success("Code copied to clipboard!");
  };
  const {
    onSent,
    codeData,
    recentPrompt,
    showResults,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);
  const clickCard = (e) => {
    const card = e.currentTarget;
    const promptText = card.querySelector("p").textContent;
    onSent(promptText);
  };
  return (
    <div className="main">
      <div className="nav">
        <p>Zallo</p>
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
                <p>Improve the readibility of the following code</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.robot} alt="" />
              {loading ? (
                <div className="loader"></div>
              ) : !codeData ? (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              ) : (
                <CopyToClipboard
                  text={codeData.replace(/``` (.*)\n/, "").replace(/```/, "")}
                  onCopy={() => handleCopy(codeData)}
                >
                  <SyntaxHighlighter
                    language={codeData.match(/``` (.*)\n/)[1]}
                    style={docco}
                  >
                    {codeData.replace(/``` (.*)\n/, "").replace(/```/, "")}
                  </SyntaxHighlighter>
                </CopyToClipboard>
              )}
            </div>
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
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
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
          <p className="bottom-info">
            Zallo may display inaccurate info, including about people, so
            double-check its response.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
