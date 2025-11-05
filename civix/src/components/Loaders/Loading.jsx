import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-full py-20 bg rounded-xl">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-gray-700 font-medium text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
