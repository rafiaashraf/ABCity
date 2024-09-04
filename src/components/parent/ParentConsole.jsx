import React from "react";
import { Courses } from "./Courses";
import { Button } from "../ui/button";
import { FaArrowRight, FaPlus } from "react-icons/fa6";

const ParentConsole = () => {
  return (
    <div className="console">
      <p className="text-3xl font-semibold bg-gradient-to-r from-purple-600 py-4 rounded-md to-purple-300 px-4">
        Parent Console
      </p>
      <div className="flex gap-4 justify-around">
        <div className=" w-1/3 mt-8 h-24 rounded-md p-4 flex items-center justify-between bg-gradient-to-tr from-pink-300 to-purple-500 ">
          <p className="text-3xl font-semibold text-black">Progress</p>
          <p className="text-xl font-bold text-black">54%</p>
        </div>
        <div className=" w-1/3 mt-8 h-24 rounded-md p-4 flex items-center justify-between bg-gradient-to-tr from-pink-300 to-purple-500 ">
          <p className="text-3xl font-semibold text-black">Course</p>
          <p className="text-xl font-bold text-black">Ace</p>
        </div>
        <div className=" w-1/3 mt-8 h-24 rounded-md p-4 flex items-center justify-between bg-gradient-to-tr from-pink-300 to-purple-500 ">
          <p className="text-3xl font-semibold text-black">Active</p>
          <p className="text-xl font-bold text-black"> 27hrs</p>
        </div>
      </div>
      <div>
        <div className="flex items-center mt-8 mb-4 justify-between">
          <p className="text-2xl font-semibold ">Active Courses</p>
          <div className="flex gap-2">
          <Button className="border border-purple-500 hover:bg-white hover:text-black flex items-center gap-2 ">Create <FaPlus/> </Button>
          <Button className="border border-purple-500 hover:bg-white hover:text-black flex items-center gap-2 ">View All <FaArrowRight/> </Button>
          </div>
        </div>
        <Courses />
      </div>
    </div>
  );
};

export default ParentConsole;
