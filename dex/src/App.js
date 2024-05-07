// App.js
import "./App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Indexes from "./components/Indexes";
import Factory from "./components/Factory";
import SetDetails from "./components/SetDetails";
import { Routes, Route } from "react-router-dom";
import { useWagmi } from './context/WagmiContext';

function App() {
  const { address, isConnected, connect } = useWagmi(); 

  return (
    <div className="App">
      <Header connect={connect} isConnected={isConnected} address={address} />
      <div className="mainWindow">
        <Routes>
          <Route path="/" element={<Factory isConnected={isConnected} address={address} />} />
          <Route path="/indexes" element={<Indexes isConnected={isConnected} address={address} />} />
          <Route path="/swap" element={<Swap isConnected={isConnected} address={address} />} />
          <Route path="/set/:address" element={<SetDetails userWallet={address} isConnected={isConnected} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
