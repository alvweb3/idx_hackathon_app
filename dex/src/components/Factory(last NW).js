import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";
import tokenList from "../tokenList.json";
import { useContractWrite, usePrepareContractWrite, useSigner } from "wagmi";
import { SetTokenCreator } from "../abis";
import { ethers } from "ethers";

function Factory() {
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [indexName, setIndexName] = useState("");
  const [indexSymbol, setIndexSymbol] = useState("");
  const [loading, setLoading] = useState(false);

  const setTokenCreatorAddress = "0xe42C49c01E10B44a9d3E64F4111c916fB499d2A5";
  const basicIssuanceModuleAddress = "0x689Fb32D4197249639441CAaD53cfa73454dC19e";
  const managerAddress = "0x9DA962465E66795F646a80e73DA1a57e78cb6c01";

  let amount1 = ethers.utils.parseEther("1");
  let amount2 = ethers.utils.parseEther("1");

  // Initial configuration, possibly replaced later by useEffect
  const [config, setConfig] = useState({
    address: setTokenCreatorAddress,
    abi: SetTokenCreator,
    functionName: 'create',
    args: [["0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000"],
           [0, 0],
           ["0x0000000000000000000000000000000000000000"],
           "0x0000000000000000000000000000000000000000",
           "ABC Token",
           "ABC"]
  });

  const { data: signer } = useSigner();
  
  useEffect(() => {
    if (selectedTokens.length > 0 && indexName && indexSymbol) {
      const componentAddresses = selectedTokens.map(token => token.token.address);
      const componentUnits = selectedTokens.map(token => ethers.utils.parseUnits(token.amount.toString(), token.token.decimals));
      const modules = [basicIssuanceModuleAddress];
      
      const newConfig = {
        address: setTokenCreatorAddress,
        abi: SetTokenCreator,
        functionName: 'create',
        args: [componentAddresses, componentUnits, modules, managerAddress, indexName, indexSymbol],
      };
      setConfig(newConfig);
    }
  }, [selectedTokens, indexName, indexSymbol]);
  
  const { contractConfig } = usePrepareContractWrite(config);
  const { data, isLoading, isSuccess, write } = useContractWrite(contractConfig);
  
  function openModal() {
    setIsOpen(true);
  }

  function modifyToken(i) {
    const tokenData = tokenList[i];
    const tokenExists = selectedTokens.some(item => item.token.ticker === tokenData.ticker);

    if (!tokenExists) {
      setSelectedTokens([...selectedTokens, { token: tokenData, amount: 1 }]);
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

  return (
    <>
      <div className="headerContainer">
        <h1>Create Your Index</h1>
        <div className="tokenContainer">
          <h2>Select the underlying tokens</h2>
          <div className="selectedTokenIndex" onClick={openModal}>
            <img src={tokenOne.img} alt={tokenOne.ticker} className="assetLogo" />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div className="selectedTokensDisplay">
            {selectedTokens.map((item, index) => (
              <div className="selectedToken2" key={index}>
                <img src={item.token.img} alt={item.token.ticker} className="tokenLogoSmall" />
                <span className="tokenTicker">{item.token.ticker}</span>
                <input type="number" value={item.amount} onChange={(e) => updateTokenAmount(item.token.ticker, e.target.value)} min="1" style={{ marginLeft: "10px" }} />
                <button className="removeTokenButton" onClick={() => removeToken(item.token.ticker)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="indexNameInput">
            <h2>Enter index name</h2>
            <input type="text" placeholder="Enter index name" value={indexName} onChange={(e) => setIndexName(e.target.value)} />
          </div>
          <div className="indexSymbolInput">
            <h2>Enter index symbol</h2>
            <input type="text" placeholder="Enter index symbol" value={indexSymbol} onChange={(e) => setIndexSymbol(e.target.value)} />
          </div>
        </div>
        <button className="createIndex" onClick={write} disabled={loading || !write}>
          {loading ? "Creating..." : "Create Index"}
        </button>
      </div>
      <Modal open={isOpen} footer={null} onCancel={() => setIsOpen(false)} title="Select a token">
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
