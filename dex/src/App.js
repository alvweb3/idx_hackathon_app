import "./App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Indexes from "./components/Indexes";
import Factory from "./components/Factory";
import SetDetails from "./components/SetDetails"; // Import the new component
import { Routes, Route } from "react-router-dom";
import { useConnect, useAccount } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

function App() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  return (
    <div className="App">
      <Header connect={connect} isConnected={isConnected} address={address} />
      <div className="mainWindow">
        <Routes>
          <Route path="/" element={<Factory isConnected={isConnected} address={address} />} />
          <Route path="/indexes" element={<Indexes isConnected={isConnected} address={address} />} />
          <Route path="/swap" element={<Swap isConnected={isConnected} address={address} />} />
          <Route path="/set/:address" element={<SetDetails />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;
