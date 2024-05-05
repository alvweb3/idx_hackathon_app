import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";
import tokenList from "../tokenList.json";
import { useContract, useSigner } from 'wagmi';
import { Controller, Erc20, SetToken } from '../abis';
import { ethers } from "ethers";

function Factory(props) {
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [indexName, setIndexName] = useState('');
  const [indexSymbol, setIndexSymbol] = useState('');
  const [loading, setLoading] = useState(false);

  const setTokenAddress = "0xa4c8d221d8BB851f83aadd0223a8900A6921A349";
  const firstModuleAddress = "";
  const secondModuleAddress = "";
  const managerAddress = "";

  const { data: signer } = useSigner();

  const setTokenCreatorContract = useContract({
    addressOrName: setTokenAddress,
    contractInterface: SetToken,
    signerOrProvider: signer,
  });

  useEffect(() => {
    if (selectedTokens.length > 0) {
      const componentAddresses = selectedTokens.map(token => token.token.address);
      console.log("Component Addresses:", componentAddresses);
      const decimaaals = selectedTokens.map(token => token.token.decimals);
      console.log("Decimals:", decimaaals);
      const componentUnits = selectedTokens.map(token => ethers.utils.parseUnits(token.amount.toString(), token.token.decimals));
      console.log("Component Units (in Wei):", componentUnits);
    }
  }, [selectedTokens]);

  async function createIndex() {
    if (!signer) return;

    setLoading(true);
    try {
      const componentAddresses = selectedTokens.map(token => token.token.address);
      const componentUnits = selectedTokens.map(token => ethers.utils.parseUnits(token.amount.toString(), token.token.decimals));
      const modules = [firstModuleAddress, secondModuleAddress];

      const tx = await setTokenCreatorContract.create(
        componentAddresses,
        componentUnits,
        modules,
        managerAddress,
        indexName,
        indexSymbol
      );
      await tx.wait();
      alert('Index created successfully!');
    } catch (error) {
      console.error('Error creating index:', error);
      alert('Failed to create index.');
    } finally {
      setLoading(false);
    }
  }

  function openModal() {
    setIsOpen(true);
  }

  function modifyToken(i) {
    const tokenData = tokenList[i];
    const tokenExists = selectedTokens.some(item => item.token.ticker === tokenData.ticker);

    if (!tokenExists) {
      setSelectedTokens([...selectedTokens, { token: tokenData, amount: 1, token: {...tokenData} }]);
    }
    setIsOpen(false);
  }

  function updateTokenAmount(ticker, newAmount) {
    setSelectedTokens(selectedTokens.map(item =>
      item.token.ticker === ticker ? { ...item, amount: parseInt(newAmount) } : item
    ));
  }

  function removeToken(ticker) {
    setSelectedTokens(selectedTokens.filter(item => item.token.ticker !== ticker));
  }

  console.log(tokenOne.img);

  return (
    <>
      <div className="headerContainer">
        <h1>Create Your Index</h1>
        <div className="tokenContainer">
          <h2>Select the underlying tokens</h2>
          <div className="selectedTokenIndex" onClick={openModal}>
            <img
              src={tokenOne.img}
              alt={tokenOne.ticker}
              className="assetLogo"
            />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div className="selectedTokensDisplay">
            {selectedTokens.map((item, index) => (
              <div className="selectedToken2" key={index}>
                <img
                  src={item.token.img}
                  alt={item.token.ticker}
                  className="tokenLogoSmall"
                />
                <span className="tokenTicker">{item.token.ticker}</span>
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => updateTokenAmount(item.token.ticker, e.target.value)}
                  min="1"
                  style={{ marginLeft: '10px' }}
                />
                <button
                  className="removeTokenButton"
                  onClick={() => removeToken(item.token.ticker)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="indexNameInput">
            <h2>Enter index name</h2>
            <input
              type="text"
              placeholder="Enter index name"
              value={indexName}
              onChange={(e) => setIndexName(e.target.value)}
            />
          </div>
          <div className="indexSymbolInput">
            <h2>Enter index symbol</h2>
            <input
              type="text"
              placeholder="Enter index symbol"
              value={indexSymbol}
              onChange={(e) => setIndexSymbol(e.target.value)}
            />
          </div>
          <p>{console.log(selectedTokens)}</p>
        </div>
        <button className="createIndex" onClick={createIndex} disabled={loading}>
          {loading ? 'Creating...' : 'Create Index'}
        </button>
      </div>
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContentIndex">
          {tokenList.map((token, i) => (
            <div className="tokenChoice" key={i} onClick={() => modifyToken(i)}>
              <img src={token.img} alt={token.ticker} className="tokenLogo" />
              <div className="tokenChoiceNames">
                <div className="tokenName">{token.name}</div>
                <div className="tokenTicker">{token.ticker}</div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}

export default Factory;
