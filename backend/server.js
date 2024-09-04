const PORT = 8000;
require('dotenv').config()
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require('express-fileupload');
const {AssemblyAI} = require('assemblyai');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const nodemailer= require('nodemailer')
const validator= require('validator');
// Dynamically import node-fetch
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
global.fetch = fetch;

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json());
dotenv.config();


const MODEL_NAME = "gemini-1.0-pro";

// Creates a client for AssemblyAI Speech-to-Text
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_AI_KEY,
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});


// Endpoint to handle contact form submissions
app.post("/contact", (req, res) => {
  const { email, message } = req.body;

  console.log(validator.isEmail(email))

  // Validate the email format
  if (!validator.isEmail(email)) {
    console.log('invalid formatt!!')
    return res.status(400).send("Invalid email format.");
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL,
    subject: 'Contact Form Submission',
    text: `Message from: ${email}\n\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Failed to send message.");
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send("Message sent successfully!");
    }
  });
});

// Endpoint to handle motivational messages generation
app.post("/motivate", async (req, res) => {
  const msg = req.body.message;

  const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1500,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  // Default chat history
  const defaultHistory = [
    {
      role: "user",
      parts: [
        {
          text: "You are the best and the most humble teacher in the world. You have a specialty in teaching children how to write letters. You correct them properly and appreciate them when they write correct. I will let you know that a particular letter is written correct or wrong and how many times. Your job is to motivate the student in simple and easy 1 line English. Be humble and polite even if the student writes the wrong letter multiple times. Make sure you respond differently every time.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Yes sure! I will generate different motivational messages for you!",
        },
      ],
    },
  ];

  // Concatenate default history with the history from the client's request
  const combinedHistory = defaultHistory.concat(req.body.history);

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: combinedHistory, // Pass the combined history to the startChat function
  });

  try {
    console.log("Sending message to model");
    const result = await chat.sendMessage(msg);
    const response = result.response;
    const text = response.text();
    console.log(text);
    res.send(text);
  } catch (err) {
    console.log(err);
    if (err.message.includes("Quota exceeded")) {
      res.status(429).send("Quota exceeded. Please try again later.");
    } else {
      res.status(500).send("An error occurred. Please try again later.");
    }
  }
});

// Endpoint to handle speech recognition using AssemblyAI
app.post('/api/recognize', async (req, res) => {
  console.log('api/recognize endpoint called');

  if (!req.files || !req.files.audio) {
    console.log('no audio');
    return res.status(400).send('No audio file uploaded.');
  }

  try {
    const audioFile = req.files.audio;
    const audioBytes = audioFile.data;

    const config = {
      audio: audioBytes,
    };

    const response = await client.transcripts.transcribe(config);
    console.log(response);

    // Check if transcription status is completed
    if (response.status === 'completed') {
      const transcription = response.text;

      if(transcription==''){
        res.json({transcription:'letter not recognized'});
      }
      else{
        console.log('Transcription:', transcription);
        res.json({ transcription });
      }
      
    } else {
      console.log('Transcription status:', response.status);
      res.status(500).send('Transcription not completed. Please try again later.');
    }
  } catch (err) {
    console.error('Error during speech recognition:', err);
    res.status(500).send('Error during speech recognition. Please try again later.');
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
