import React, { useState } from "react";
import { Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";
import tokenList from "../tokenList.json";

function Factory(props) {
  // Updated to handle tokens with amounts
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [indexName, setIndexName] = useState('');
  const [indexSymbol, setIndexSymbol] = useState('');

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
      <div className="createIndex">Create Index</div>
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
