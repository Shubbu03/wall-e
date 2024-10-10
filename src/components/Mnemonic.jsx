/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";

function Mnemonic() {
  window.Buffer = Buffer;
  const navigate = useNavigate();
  const [mnemonic, setMnemonic] = useState("");
  const [showToast, setShowToast] = useState(false);

  const newMnemonic = () => {
    const userMnemonic = generateMnemonic();
    setMnemonic(userMnemonic);
    const userSeed = mnemonicToSeedSync(userMnemonic);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto">
          <a href="/" className="text-2xl font-bold">
            Web-Wallet
          </a>
        </div>
      </nav>
      <main className="flex-grow flex items-center justify-center">
        {!mnemonic && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">
              Generate Mnemonic to start
            </h1>
            <button
              onClick={newMnemonic}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300 cursor-pointer"
            >
              Generate Mnemonic
            </button>
          </div>
        )}
        {mnemonic && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Your Mnemonic is:</h1>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {mnemonic.split(" ").map((word, index) => (
                <div
                  key={index}
                  onClick={copyToClipboard}
                  className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700 transition duration-300"
                >
                  {word}
                </div>
              ))}
            </div>
            <button
              onClick={newMnemonic}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300 cursor-pointer"
            >
              Generate New Mnemonic
            </button>
            <div className="flex justify-center space-x-4 pt-5">
              <button
                onClick={() => navigate("/sol-wallet", { state: { mnemonic } })}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg"
              >
                Create SOL Wallet
              </button>
              <button
                onClick={() => navigate("/eth-wallet", { state: { mnemonic } })}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg"
              >
                Create ETH Wallet
              </button>
            </div>
          </div>
        )}
      </main>
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Mnemonic copied to clipboard!
        </div>
      )}
    </div>
  );
}

export default Mnemonic;
