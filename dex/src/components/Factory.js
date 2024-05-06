import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";
import tokenList from "../tokenList.json";
import { useContractWrite, useSigner, usePrepareContractWrite } from "wagmi";
import { Controller, Erc20, SetToken, SetTokenCreator } from "../abis";
import { ethers } from "ethers";
import { isAddress } from 'web3-validator';

function Factory(props) {
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [indexName, setIndexName] = useState("");
  const [indexSymbol, setIndexSymbol] = useState("");
  const [loading, setLoading] = useState(false);

  const setTokenCreatorAddress = "0x1D7022f5B17d2F8B695918FB48fa1089C9f85401";
  const firstModuleAddress = "0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c";
  const managerAddress = "0x5409ed021d9299bf6814279a6a1411a7e866a631";

  let amount1 =  ethers.utils.parseEther("1");
  let amount2 =  ethers.utils.parseEther("1");

  const { data: signer } = useSigner();

  const { config } = usePrepareContractWrite({
    address: setTokenCreatorAddress,
    abi: SetTokenCreator,
    functionName: 'create',
    args: [["0x48bacb9266a570d521063ef5dd96e61686dbe788", "0x34d402f14d58e001d8efbe6585051bf9706aa064"],
    [amount1, amount2],
    ["0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c"],
    "0x5409ed021d9299bf6814279a6a1411a7e866a631",
    "test",
    "TTT"],
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  /*
  const { data: signer } = useSigner();

  const setTokenCreator = new ethers.Contract(
    setTokenCreatorAddress,
    SetTokenCreator,
    signer
  );
  */

  /*
  useEffect(() => {
    if (selectedTokens.length > 0) {
      const componentAddresses = selectedTokens.map(
        (token) => token.token.address
      );
      console.log("Component Addresses:", componentAddresses);
      const decimaaals = selectedTokens.map((token) => token.token.decimals);
      console.log("Decimals:", decimaaals);
      const componentUnits = selectedTokens.map((token) =>
        ethers.utils.parseUnits(token.amount.toString(), token.token.decimals)
      );
      console.log("Component Units (in Wei):", componentUnits);
    }
  }, [selectedTokens]);
  

  async function createIndex() {
    if (!signer) return;

    setLoading(true);
    try {
      const componentAddresses = selectedTokens.map(
        (token) => token.token.address
      );
      const componentUnits = selectedTokens.map((token) =>
        ethers.utils.parseUnits(token.amount.toString(), token.token.decimals)
      );
      const modules = [firstModuleAddress];

      console.log("Component addresses: ", componentAddresses);
      console.log("Component Units: ", componentUnits);
      console.log("Modules: ", modules);
      console.log("Manager address: ", managerAddress);
      console.log("Index Name: ", indexName);
      console.log("Index Symbol: ", indexSymbol);

      console.log("Component addresses: ", typeof componentAddresses);
      console.log("Component Units: ", typeof componentUnits);
      console.log("Modules: ", typeof modules);
      console.log("Manager address: ", typeof managerAddress);
      console.log("Index Name: ", typeof indexName);
      console.log("Index Symbol: ", typeof indexSymbol);

      const tx = await contract.create(
        ["0x48bacb9266a570d521063ef5dd96e61686dbe788", "0x34d402f14d58e001d8efbe6585051bf9706aa064"],
        [1000000000000000000, 1000000000000000000],
        ["0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c"],
        "0x5409ed021d9299bf6814279a6a1411a7e866a631",
        "test",
        "TTT"
      );

      
      //const tx = await contract.create(
      //  componentAddresses,
      //  componentUnits,
      //  modules,
      //  managerAddress,
      //  indexName,
      //  indexSymbol
      //);
      
      await tx.wait();
      alert("Index created successfully!");
    } catch (error) {
      console.error("Error creating index:", error);
      alert("Failed to create index.");
    } finally {
      setLoading(false);
    }
  }
  */

  function openModal() {
    setIsOpen(true);
  }

  function modifyToken(i) {
    const tokenData = tokenList[i];
    const tokenExists = selectedTokens.some(
      (item) => item.token.ticker === tokenData.ticker
    );

    if (!tokenExists) {
      setSelectedTokens([
        ...selectedTokens,
        { token: tokenData, amount: 1, token: { ...tokenData } },
      ]);
    }
    setIsOpen(false);
  }

  function updateTokenAmount(ticker, newAmount) {
    setSelectedTokens(
      selectedTokens.map((item) =>
        item.token.ticker === ticker
          ? { ...item, amount: parseInt(newAmount) }
          : item
      )
    );
  }

  function removeToken(ticker) {
    setSelectedTokens(
      selectedTokens.filter((item) => item.token.ticker !== ticker)
    );
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
                  onChange={(e) =>
                    updateTokenAmount(item.token.ticker, e.target.value)
                  }
                  min="1"
                  style={{ marginLeft: "10px" }}
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
          <p>{console.log(isAddress(setTokenCreatorAddress))}</p>
        </div>
        <button
          className="createIndex"
          onClick={() => write?.()}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Index"}
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
