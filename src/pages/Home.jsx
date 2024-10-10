import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mnemonic from "../components/Mnemonic";
import SolanaWallet from "../components/SolanaWallet";
import EthereumWallet from "../components/EthereumWallet";

const Home = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mnemonic />} />
        <Route path="/sol-wallet" element={<SolanaWallet />} />
        <Route path="/eth-wallet" element={<EthereumWallet />} />
      </Routes>
    </Router>
  );
};

export default Home;
