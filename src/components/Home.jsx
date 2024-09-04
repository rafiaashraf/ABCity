import React from 'react';
import { ContactUs } from './ContactUs';
import { TestimonyPage } from './Testimonials';
import { About } from './About';
import Hero from './Hero';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  return (
    <div className='w-full'>
      <Hero />
      <About />
      <TestimonyPage />
      <div id="contactUsSection">
        <ContactUs />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;
