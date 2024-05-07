import React, { createContext, useContext } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

const WagmiContext = createContext();

export const WagmiProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  return (
    <WagmiContext.Provider value={{ address, isConnected, connect }}>
      {children}
    </WagmiContext.Provider>
  );
};

export const useWagmi = () => useContext(WagmiContext);