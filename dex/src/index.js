import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { WagmiProvider } from './context/WagmiContext';

export const cantoTestnet = {
  id: 7701,
  name: 'Canto Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Canto',
    symbol: 'CANTO',
  },
  rpcUrls: {
    default: 'https://canto-testnet.plexnode.wtf',
  },
  blockExplorers: {
    default: { name: 'Tuber', url: 'https://testnet.tuber.build/' },
  },
};

const { provider } = configureChains([cantoTestnet], [jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) })]);
const client = createClient({ autoConnect: true, provider });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <WagmiProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WagmiProvider>
    </WagmiConfig>
  </React.StrictMode>
);
