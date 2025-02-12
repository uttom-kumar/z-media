import React, { useState } from "react";

const QrCodeComponent = () => {
  const [selectedColor, setSelectedColor] = useState("#1DA1F2"); // Default primary color for the gradient
  const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?data=UTTOM3558&size=200x200`; // Static QR code

  const gradientColors = [
    "#000000", // Black
    "#1DA1F2", // Blue
    "#5BC236", // Green
    "#FF5A5F", // Red
    "#FF9800", // Orange
    "#9C27B0", // Purple
  ];

  return (
    <div
      className="text-white px-5 min-h-screen flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${selectedColor}, #ffffff)`, // Gradient effect
      }}
    >
      <div className="w-full max-w-6xl   flex flex-col lg:flex-row gap-10 p-8 items-center">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center space-y-5">
          <div className="p-5 bg-white rounded-lg shadow-md">
            <img
              src={qrCodeURL}
              alt="QR Code"
              className="rounded-lg w-[200px] md:w-[250px]"
            />
            <h2 className="text-lg mt-5 text-black font-bold text-center">
              {"UTTOM3558"}
            </h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800">
            QR code helps people follow you quickly
          </h1>
          <p className="text-sm lg:text-base text-gray-600 mb-6">
            People can scan your QR code with their smartphone's camera to see
            your profile. Download and print your QR code, then stick it on your
            products, posters, and more.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {gradientColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)} // Change the gradient primary color
                className={`w-8 h-8 rounded-full border-4 ${
                  selectedColor === color ? "border-gray-800" : "border-gray-200"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600 duration-300"
            onClick={() => window.open(qrCodeURL, "_blank")}
          >
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrCodeComponent;
