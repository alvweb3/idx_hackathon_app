import React, { useState } from "react";
import { Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";
import tokenList from "../tokenList.json";

function Factory(props) {
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [indexName, setIndexName] = useState('');
  const [indexSymbol, setIndexSymbol] = useState('');


  function openModal() {
    setIsOpen(true);
  }

  function modifyToken(i) {
    setTokenOne(tokenList[i]);
    if (!selectedTokens.find(token => token.ticker === tokenList[i].ticker)) {
      setSelectedTokens([...selectedTokens, tokenList[i]]);
    }
    setIsOpen(false);
  }

  function removeToken(ticker) {
    setSelectedTokens(selectedTokens.filter(token => token.ticker !== ticker));
  }

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
            {selectedTokens.map((token, index) => (
              <div className="selectedToken" key={index}>
                <img
                  src={token.img}
                  alt={token.ticker}
                  className="tokenLogoSmall"
                />
                {token.ticker}
                <button
                  className="removeTokenButton"
                  onClick={() => removeToken(token.ticker)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="indexNameInput">
            <h2>Choose an index name</h2>
            <input
              type="text"
              placeholder="Enter index name"
              value={indexName}
              onChange={(e) => setIndexName(e.target.value)}
            />
          </div>
          <div className="indexSymbolInput">
            <h2>Choose an index symbol</h2>
            <input
              type="text"
              placeholder="Enter index symbol"
              value={indexSymbol}
              onChange={(e) => setIndexSymbol(e.target.value)}
            />
          </div>
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
