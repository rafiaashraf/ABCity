import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { FaArrowLeft, FaArrowRight, FaSpinner } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { alphabetData } from "../../utils/data";
import { speakWord, startIntro } from "@/lib/utils";
import { BsFillMicFill } from "react-icons/bs";

// Loader component
const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <FaSpinner className="animate-spin text-6xl text-white" />
  </div>
);

const ChildConsole = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#000000");
  const [penWidth, setPenWidth] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedCommand, setRecognizedCommand] = useState("");
  const [recognizedLetter, setRecognizedLetter] = useState(""); // New state for recognized letter
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const canvasRef = useRef(null);
  const drawingPathsRef = useRef([]);
  const prevCanvasSizeRef = useRef({ width: 0, height: 0 });
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const prevWidth = prevCanvasSizeRef.current.width;
      const prevHeight = prevCanvasSizeRef.current.height;

      const canvasDiv = document.querySelector(".canvas-div");
      const newWidth = canvasDiv.clientWidth;
      const newHeight = canvasDiv.clientHeight;

      canvas.width = newWidth;
      canvas.height = newHeight;

      context.clearRect(0, 0, newWidth, newHeight);
      drawLetter(context, newWidth, newHeight);
      redrawPaths(context, newWidth, newHeight, prevWidth, prevHeight);

      prevCanvasSizeRef.current = { width: newWidth, height: newHeight };
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentIndex]);

  useEffect(() => {
    startIntro();
  }, []);

  useEffect(() => {
    if (recognizedCommand) {
      processCommand(recognizedCommand);
    }
  }, [recognizedCommand]);

  useEffect(() => {
    if (recognizedLetter) {
      const newIndex = alphabetData.findIndex((item) => item.letter === recognizedLetter);
      setCurrentIndex(newIndex);
      drawingPathsRef.current = [];
    }
  }, [recognizedLetter]);

  const drawLetter = (context, canvasWidth, canvasHeight) => {
    const maxFontSize = Math.min(canvasWidth, canvasHeight) * 0.7;
    context.fillStyle = "rgba(0, 0, 0, 0.2)";
    context.font = `${maxFontSize}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
      alphabetData[currentIndex].letter,
      canvasWidth / 2,
      canvasHeight / 2
    );
  };

  const redrawPaths = (
    context,
    canvasWidth,
    canvasHeight,
    prevCanvasWidth,
    prevCanvasHeight
  ) => {
    drawingPathsRef.current.forEach(({ path, color, width }) => {
      context.beginPath();
      path.forEach(([x, y], index) => {
        const newX = (x / prevCanvasWidth) * canvasWidth;
        const newY = (y / prevCanvasHeight) * canvasHeight;
        if (index === 0) {
          context.moveTo(newX, newY);
        } else {
          context.lineTo(newX, newY);
        }
      });
      context.strokeStyle = color;
      context.lineWidth = width;
      context.stroke();
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % alphabetData.length);
    drawingPathsRef.current = [];
    setRecognizedLetter(""); // Reset recognized letter
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + alphabetData.length) % alphabetData.length
    );
    drawingPathsRef.current = [];
    setRecognizedLetter(""); // Reset recognized letter
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawLetter(context, canvasWidth, canvasHeight);
    drawingPathsRef.current = [];
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawingPathsRef.current.push({
      path: [[x, y]],
      color: penColor,
      width: penWidth,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const currentPath =
      drawingPathsRef.current[drawingPathsRef.current.length - 1].path;
    currentPath.push([x, y]);

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawLetter(context, canvas.width, canvas.height);
    redrawPaths(
      context,
      canvas.width,
      canvas.height,
      prevCanvasSizeRef.current.width,
      prevCanvasSizeRef.current.height
    );
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleLetterSelect = (letter) => {
  const newIndex = alphabetData.findIndex((item) => item.letter === letter);
  setCurrentIndex(newIndex);
  drawingPathsRef.current = [];
  setRecognizedLetter(""); // Reset recognized letter
  setIsModalOpen(false);
};


  const processCommand = (command) => {
    const normalizedCommand = command.toLowerCase().trim();
    let letter = null;

    // Split the command into words
    const words = normalizedCommand.split(" ");

    // Iterate through the words to find a recognized letter
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      // Check if the word is a recognized letter
      if (alphabetData.some((item) => item.letter === word.toUpperCase())) {
        letter = word.toUpperCase();
        break;
      }
    }

    if (letter) {
      setRecognizedLetter(letter); // Set recognized letter to state
      setIsListening(false);
    } else {
      speakWord("Sorry, I didn't recognize the letter. Please try again.");
    }
    setIsLoading(false); // Stop loading after processing command
  };

  const toggleSpeechRecognition = async () => {
    setIsListening((prevState) => !prevState);

    if (!isListening) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioFile = new File([audioBlob], "speech.wav", {
          type: "audio/wav",
        });

        const formData = new FormData();
        formData.append("audio", audioFile);

        console.log("api/recognize api called");
        setIsLoading(true); // Start loading when API call begins

        const response = await fetch("http://localhost:8000/api/recognize", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        setRecognizedCommand(data.transcription);
      });

      mediaRecorderRef.current.start();
    } else {
      mediaRecorderRef.current.stop();
    }
  };

  const { letter, word, image } = alphabetData[currentIndex];
  const displayLetter = recognizedLetter || letter;

  return (
    <div className="console p-4">
    {isLoading && <Loader />}
    <div className="utility-bar-2 flex justify-between items-center mb-4 ">
      <p className="text-lg font-bold">Learn Alphabets</p>
      <div className="flex items-center">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="select-button utility-btn"
        >
          Select Letter
        </Button>
        <button
          onClick={toggleSpeechRecognition}
          className={`ml-2 focus:outline-none mic-button ${
            isListening ? "mic-active" : ""
          }`}
        >
          <BsFillMicFill
            className={`w-6 h-6 ${
              isListening ? "text-bright" : " "
            }`}
          />
        </button>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <Button onClick={handleClear} className="clear-button utility-btn">
        Clear
      </Button>
      <Button
        onClick={() => {
          speakWord(word);
        }}
        className="speak-button utility-btn"
      >
        Speak <HiSpeakerphone />
      </Button>
      <Button
        onClick={handlePrevious}
        className="previous-button utility-btn"
      >
        <FaArrowLeft /> Previous
      </Button>
      <Button onClick={handleNext} className="next-button utility-btn">
        Next <FaArrowRight />
      </Button>
    </div>
    <div className="flex items-center gap-4 my-4">
      <div className="utility-display">
        {isLoading ? (
          <FaSpinner className="animate-spin text-9xl" />
        ) : (
          <p className="text-black text-9xl font-bold">
            {displayLetter}
          </p>
        )}
      </div>
      <div className="utility-display">
        <img src={image} className="w-32" alt={letter} />
      </div>
    </div>
    <div className="canvas-div w-full h-96 rounded-md border-dashed border flex items-center justify-center cursor-pointer">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        style={{
          border: "1px solid #000",
          borderRadius: "5px",
          backgroundColor: "#fff",
          cursor: "pointer",
          width: "98%",
          height: "95%",
        }}
      />
    </div>
    <div className="flex items-center justify-center mt-4 gap-2">
      <p>Color</p>
      <label className="rounded-md bg-orange-50 p-1">
        <input
          type="color"
          value={penColor}
          onChange={(e) => setPenColor(e.target.value)}
          className="color-input"
        />
      </label>
      <input
        type="range"
        min="1"
        max="20"
        value={penWidth}
        className="width-input"
        onChange={(e) => setPenWidth(e.target.value)}
      />
    </div>

    {isModalOpen && (
      <div className="modal-bg z-50">
        <div className="modal-content">
          <h2 className="text-lg font-bold mb-4">Select a Letter</h2>
          <div className="grid grid-cols-4 gap-2">
            {alphabetData.map((item) => (
              <Button
                key={item.letter}
                onClick={() => handleLetterSelect(item.letter)}
                className="speak-button utility-btn text-2xl"
              >
                {item.letter}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-800"
          >
            Close
          </Button>
        </div>
      </div>
    )}

    <style jsx>{`
      .modal-bg {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-content {
        background-color: #1a202c;
        width: 70%;
        max-width: 600px;
        padding: 20px;
        border-radius: 8px;
        overflow-y: auto;
        max-height: 80%;
      }
      .mic-active {
        animation: pulse 1.5s infinite;
      }
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
      .text-bright {
        color: #ff0000;
      }
    `}</style>
  </div>
  );
};

export default ChildConsole;
export {Loader}
