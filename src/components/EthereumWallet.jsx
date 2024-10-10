/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { mnemonicToSeedSync } from "bip39";
import { HDNodeWallet, Wallet } from "ethers";

function EthereumWallet() {
  const location = useLocation();
  const navigate = useNavigate();
  const mnemonic = location.state.mnemonic;
  const [wallets, setWallets] = useState([]);
  const [openWallet, setOpenWallet] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const seed = mnemonic ? mnemonicToSeedSync(mnemonic) : null;

  const createNewETHWallet = () => {
    const account = wallets.length;
    const path = `m/44'/60'/${account}/1'`;
    const hdnode = HDNodeWallet.fromSeed(seed);
    const child = hdnode.derivePath(path);
    const privateKey = child.privateKey;
    const address = new Wallet(privateKey).address;
    setWallets([...wallets, { account, address }]);
  };

  const toggleWallet = (account) => {
    setOpenWallet(openWallet === account ? null : account);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToastMessage("Address copied to clipboard!");
    });
  };

  const deleteWallet = (accountToDelete) => {
    setWallets(wallets.filter((wallet) => wallet.account !== accountToDelete));
    showToastMessage("Wallet deleted successfully!");
  };

  const deleteAllWallets = () => {
    setWallets([]);
    showToastMessage("All wallets deleted successfully!");
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Web-Wallet
          </Link>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Main Page
            </button>
            <button
              onClick={() => navigate("/sol-wallet", { state: { mnemonic } })}
              className="  bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              SOL Wallet
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-grow flex flex-col items-center justify-start p-8">
        {mnemonic ? (
          <>
            <h1 className="text-4xl font-bold mb-6">Your Ethereum Wallets</h1>
            <div className="flex space-x-4 mb-8">
              <button
                onClick={createNewETHWallet}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg"
              >
                Create New Ethereum Wallet
              </button>
              {wallets.length > 0 && (
                <button
                  onClick={deleteAllWallets}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg"
                >
                  Delete All Wallets
                </button>
              )}
            </div>

            {wallets.length > 0 ? (
              <div className="w-full max-w-2xl">
                {wallets.map((wallet) => (
                  <div key={wallet.account} className="mb-4">
                    <button
                      onClick={() => toggleWallet(wallet.account)}
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300 flex justify-between items-center"
                    >
                      <span>Account {wallet.account}</span>
                      <span>{openWallet === wallet.account ? "▲" : "▼"}</span>
                    </button>
                    {openWallet === wallet.account && (
                      <div className="mt-2 p-4 bg-gray-700 rounded">
                        <p className="font-semibold">Address:</p>
                        <div className="flex items-center mt-2">
                          <p className="break-all mr-2 flex-grow">
                            {wallet.address}
                          </p>
                          <button
                            onClick={() => copyToClipboard(wallet.address)}
                            className="text-blue-400 hover:text-blue-300 mr-2"
                            title="Copy public key"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteWallet(wallet.account)}
                            className="text-red-400 hover:text-red-300"
                            title="Delete wallet"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xl">
                No wallets created yet. Click the button above to create your
                first wallet.
              </p>
            )}
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">No Mnemonic Found</h1>
            <p className="mb-4 text-red-500">
              No mnemonic provided. Please generate one from the main page.
            </p>
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Back to Main Page
            </Link>
          </div>
        )}
      </main>
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default EthereumWallet;
