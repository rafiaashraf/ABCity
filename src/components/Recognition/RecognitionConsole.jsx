import "./style.css";
import ConfettiExplosion from "react-confetti-explosion";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { alphabetData } from "../../utils/data";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cheer from "../../assets/crowd-cheering.mp3";
import sadSound from "../../assets/sad-sound.mp3"
import { speakOnLoad, speakWord, startRecIntro } from "@/lib/utils";
import axios from "axios";
import { Loader } from "../child/ChildConsole";
import { startIntro } from "@/lib/utils";
const RecognitionConsole = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currLetter, setCurrLetter] = useState("");
  const [currLetterIndex, setCurrLetterIndex] = useState(0);
  const [wrongLetter, setWrongLetter] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [wrongLetterWord, setWrongLetterWord] = useState("");
  const [AiText, setAiText] = useState("");
  const [statistics, setStatistics] = useState({
    correct: 0,
    wrong: 0,
    letter: "A",
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Update currLetter whenever currentIndex changes
  useEffect(() => {
    const { letter } = alphabetData[currentIndex];
    setCurrLetter(() => letter); // Using callback function syntax
    //randomly pick one
    const randomIndex = Math.floor(Math.random() * alphabetData[currentIndex].word.length);
    setCurrLetterIndex(randomIndex);
  }, [currentIndex]);

    useEffect(() => {
      startRecIntro();
    }, []);

  // play sound when correct is true for 3 sec
  useEffect(() => {
    if (correct) {
      const audio = new Audio(cheer);
      audio.play();
      setTimeout(() => {
        audio.pause();
      }, 6000);
    } else if (wrongLetter) {
      const audio = new Audio(sadSound);
      audio.play();
      setTimeout(() => {
        audio.pause();
      }, 3000); // Adjust duration as per your preference
    }
  }, [correct, wrongLetter]);
  
  useEffect(() => {
    const script = document.createElement("script");
    const script2 = document.createElement("script");
    script.src = "src/components/Recognition/letterRecognition.js";
    script2.src = "src/components/Recognition/weights.js";
    script.async = true;
    script2.async = true;

    document.body.appendChild(script);
    document.body.appendChild(script2);
    const checkButton = document.getElementById("check-button");
    return () => {
      document.body.removeChild(script);
      document.body.removeChild(script2);
      if (checkButton) {
        checkButton.removeEventListener("click", handleCheck);
      }
    };
  }, []);

  const handleCheck = async () => {
    setLoading(true); // Start loading
    try {
      const firstPredictionText = document
        .getElementById("prediction-0")
        .textContent.trim();

      const { letter } = alphabetData[currentIndex];

      if (firstPredictionText.toUpperCase() === currLetter.trim().toUpperCase()) {
        toast.success("Prediction matches the displayed letter!");
        clearCanvas();
        setCorrect(true);
        setWrongLetter(false);

        // Update local storage for correct writings
        const localStorageData = JSON.parse(localStorage.getItem("writingStats")) || { correct: 0, wrong: 0, letter: "A" };
        localStorageData.correct += 1;
        localStorage.setItem("writingStats", JSON.stringify(localStorageData));
      } else {
        setWrongLetter(true);
        setCorrect(false);
        setWrongLetterWord(firstPredictionText);
        toast.error("Prediction does not match the displayed letter.");

        // Play sad sound
        const audio = new Audio(sadSound);
        audio.play();

        // Update local storage for wrong writings
        const localStorageData = JSON.parse(localStorage.getItem("writingStats")) || { correct: 0, wrong: 0, letter: "A" };
        localStorageData.wrong += 1;
        localStorage.setItem("writingStats", JSON.stringify(localStorageData));
      }

      await sendRequest(); // Send API request
    } catch (error) {
      toast.error("Error during letter recognition.");
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    const message = "Hello buddy! Please write in the specified area.";
    speakOnLoad(message);
    localStorage.setItem("writingStats", JSON.stringify({ correct: 0, wrong: 0, letter: "A" }));
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % alphabetData.length;
    const nextLetter = alphabetData[nextIndex].letter;

    setCorrect(false);
    setCurrentIndex(nextIndex);
    setCurrLetter(nextLetter);
    setChatHistory([]);
    setWrongLetter(false);

    // update the local storage
    const localStorageData = JSON.parse(
      localStorage.getItem("writingStats")
    ) || { correct: 0, wrong: 0, letter: "A" };
    localStorageData.correct = 0;
    localStorageData.wrong = 0;
    localStorageData.letter = nextLetter;

    localStorage.setItem("writingStats", JSON.stringify(localStorageData));

    console.log("current letter set to ", nextLetter);
    clearCanvas();
  };

  const handlePrevious = () => {
    setCorrect(false);
    const prevIndex =
      (currentIndex - 1 + alphabetData.length) % alphabetData.length;
    setCurrentIndex(prevIndex);
    const prevLetter = alphabetData[prevIndex].letter
    setChatHistory([]);

    // update the local storage
    const localStorageData = JSON.parse(
      localStorage.getItem("writingStats")
    ) || { correct: 0, wrong: 0, letter: "A" };
    localStorageData.correct = 0;
    localStorageData.wrong = 0;
    localStorageData.letter = prevLetter;
    localStorage.setItem("writingStats", JSON.stringify(localStorageData));
  };

  const { letter, word, image } = alphabetData[currentIndex];

  // send api request to backend
  const sendRequest = async () => {
    const statisticsLocal = JSON.parse(localStorage.getItem("writingStats"));
    const message = `The student has written ${statisticsLocal.letter} ${statisticsLocal.correct} times correctly and ${statisticsLocal.wrong} times wrong. `;
    console.log(message)
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: message,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/motivate", options);
      const data = await response.text();
      console.log(data);
      console.log(response);

      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [
            {
              text: message,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: data,
            },
          ],
        },
      ]);
      console.log(chatHistory)
      console.log("AI test received: ",data)
      setAiText(data)
      // speak this ai text
      speakWord(data)
    } catch (error) {
      console.error(error);
      toast.error("Failed to send request to the server.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 pt-16">
      {!loading && correct && <ConfettiExplosion numberOfPieces={400} duration={4000} />}
      {!loading && correct && <ConfettiExplosion numberOfPieces={400} duration={6000} />}
      <ToastContainer />
      <div className="utility-bar">
        <p className="">Recognition</p>
        <div className="flex flex-wrap items-center gap-2 sm:mt-0 mt-4">
          <Button
            onClick={() => {
              speakWord(word[currLetterIndex]);
            }}
            className="speak-button utility-btn"
          >
            Speak <HiSpeakerphone />
          </Button>
          <Button
            onClick={handlePrevious}
            className="previous-button utility-btn"
          >
            <FaArrowLeft /> Previous{" "}
          </Button>
          <Button onClick={handleNext} className="next-button utility-btn">
            Next <FaArrowRight />
          </Button>
          <Button
            onClick={handleCheck}
            id="check-button"
            className="check-button utility-btn"
          >
            Check
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4 my-4 w-3/4 ">
        <div className="utility-display">
          <p className="text-black text-8xl font-bold">{currLetter}</p>
        </div>
        <div className="utility-display">
          <img src={image[currLetterIndex]} className="h-32 p-2" alt={letter} />
        </div>
      </div>
      {loading && (
        <Loader />  
      )}
      {!loading && wrongLetter && (
        <div className="flex flex-col items-center justify-center gap-2 w-3/4">
          <h1 className="text-2xl font-bold">
          Wrong letter, you have written {wrongLetterWord}{" "}
        </h1>
        <h1 className="text-2xl font-bold text-center">
          {AiText}
        </h1>
        </div>
      )}
      {!loading && correct &&(<div className="flex flex-col items-center justify-center gap-2 w-3/4">
        <h1 className="text-2xl font-bold">You are correct 🎉🎉 </h1>
        <h1 className="text-2xl font-bold text-center">{AiText} </h1>
      </div>)}
      {!loading && correct && <ConfettiExplosion numberOfPieces={200} duration={6000} />}
      {!loading && correct && <ConfettiExplosion numberOfPieces={400} duration={4000} />}
     
      <div className="pt-4 min-h-screen"
        dangerouslySetInnerHTML={{
          __html: `
            <div class="container mx-auto px-4 sm:px-2">
              <div class="md:row flex col-auto md:flex-wrap justify-center">
                <div class="draw-panel flex flex-col sm:flex-row gap-1 items-center sm:items-start">
                  <img src="/pointer.gif" alt="A" class="hidden sm:block w-60 sm:w-64 mb-4 sm:mb-0"/>
                  <div class="col sm:mr-14 mb-4 sm:mb-0">
                    <div class="card-paneL canvas-paneL no-pad hoverable">
                      <canvas
                        class="canvas elevation"
                        id="canvas"
                        width="280"
                        height="280"
                      ></canvas>
                    </div>
                  </div>
                  <div class="card-panel hoverable col w-full">
                    <div id="pred" class="predictions">
                      <div class="prediction-col" id="prediction-0">
                        <div class="prediction-bar-container">
                          <div class="prediction-bar"></div>
                        </div>
                        <div class="prediction-number rotated">A</div>
                      </div>
              
                      <div class="prediction-col" id="prediction-1">
                        <div class="prediction-bar-container">
                          <div class="prediction-bar"></div>
                        </div>
                        <div class="prediction-number rotated">B</div>
                      </div>
              
                      <div class="prediction-col" id="prediction-2">
                        <div class="prediction-bar-container">
                          <div class="prediction-bar"></div>
                        </div>
                        <div class="prediction-number rotated">C</div>
                      </div>
              
                      <div class="prediction-col" id="prediction-3">
                        <div class="prediction-bar-container">
                          <div class="prediction-bar"></div>
                        </div>
                        <div class="prediction-number rotated">D</div>
                      </div>
              
                      <div class="prediction-col" id="prediction-4">
                        <div class="prediction-bar-container">
                          <div class="prediction-bar"></div>
                        </div>
                        <div class="prediction-number rotated">E</div>
                      </div>
              
                      <div class="prediction-col" id="prediction-5">
                        <div class="prediction-bar-container">
                          <div class="prediction-bar"></div>
                        </div>
                        <div class="prediction-number rotated">F</div>
                      </div>
              
                      <div class="prediction-col" id="prediction-6">
                        <div class="prediction-bar-container">
                          <div class="prediction-bar"></div>
                        </div>
                        <div class="prediction-number rotated">G</div>
                      </div>
              
                      <div class="prediction-col" id="prediction-7">
                        <div class="prediction-bar-container">
                          <div class="prediction-bar"></div>
                        </div>
                        <div class="prediction-number rotated">H</div>
                      </div>
              
                      <div class="prediction-col" id="prediction-8">
                        <div class="prediction-bar-container">
                          <div class="prediction-bar"></div>
                        </div>
                        <div class="prediction-number rotated">I</div>
                      </div>
              
                      <div class="prediction-col" id="prediction-9">
                        <div class="prediction-bar-container">
                          <div class="prediction-bar"></div>
                        </div>
                        <div class="prediction-number rotated">J</div>
                      </div>
                    </div>
                    <div class="button-pad center mt-4">
                      <a id="clear-button" class=" cursor-pointer waves-effect waves-light btn text-pink-500">CLEAR</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `,
        }}
      />
    </div>
  );
};

export default RecognitionConsole;
