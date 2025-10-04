import React from "react";

const DotsLoader = ({ color = "bg-blue-900" }) => {
  return (
    <div className="flex items-center h-full justify-center">
      <div className="flex space-x-3">
        <span
          className={`w-5 h-5 ${color} rounded-full animate-bounce [animation-duration:0.6s]`}
        ></span>
        <span
          className={`w-5 h-5 ${color} rounded-full animate-bounce [animation-delay:-0.2s] [animation-duration:0.6s]`}
        ></span>
        <span
          className={`w-5 h-5 ${color} rounded-full animate-bounce [animation-delay:-0.4s] [animation-duration:0.6s]`}
        ></span>
      </div>
    </div>
  );
};

export default DotsLoader;
