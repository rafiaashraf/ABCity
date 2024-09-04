import React, { useState } from "react";
import { BackgroundBeams } from "./ui/background-beams";
import { Input } from "./ui/input";
import axios from "axios";
import { toast } from "react-toastify";

export function ContactUs() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/contact", {
        email,
        message,
      });
      console.log('Response is :', response);
      toast.success("Message sent successfully!");
      setEmail('')
      setMessage('')
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data === 'Invalid email format.') {
        toast.error("Please Enter Valid Email");
        
      } else {
        toast.error("Failed to send message");
      }
    }
  };

  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-3xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-cyan-600 to-purple-600 text-center font-sans font-bold">
          Contact Us
        </h1>
        <p className="text-purple-300 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Send us a message using your email and we'll get back to you soon.
        </p>
        <form onSubmit={handleSubmit} className="relative z-20">
          <Input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-white w-full mb-4 bg-black"
          />
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 text-white bg-black rounded mb-4"
            rows="4"
          />
          <button
            type="submit"
            className="w-full p-2 bg-gradient-to-b from-cyan-700 to-purple-600 text-white rounded hover:bg-purple-700"
          >
            Send Message
          </button>
        </form>
      </div>
      <BackgroundBeams />
    </div>
  );
}
