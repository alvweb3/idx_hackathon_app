import React, { useEffect, useState } from 'react';
import { useContractReads } from 'wagmi';
import { useParams } from 'react-router-dom';
import { Erc20, SetToken } from '../abis';
import {ethers} from "ethers";

function SetDetails() {
  const { address } = useParams(); // Get the address from the URL
  const [tokenContracts, setTokenContracts] = useState([]);
  const [tokenAmount, setTokenAmount] = useState('');

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      { abi: SetToken, address, functionName: 'name' },
      { abi: SetToken, address, functionName: 'symbol' },
      { abi: SetToken, address, functionName: 'totalSupply' },
      { abi: SetToken, address, functionName: 'decimals' },
      { abi: SetToken, address, functionName: 'getComponents' },
    ],
  });

  useEffect(() => {
    if (data && data[4] && data[4].length) {
      setTokenContracts(data[4].map((address) => ({
        abi: Erc20,
        address,
        functionName: 'name'
      })));
    }
  }, [data]);

  const { data: tokenNames, isLoading: tokenNamesLoading, isError: tokenNamesError } = useContractReads({
    contracts: tokenContracts
  });

  function formatUnits(value, decimals) {
    let display = value.toString();

    const negative = display.startsWith("-");
    if (negative) display = display.slice(1);

    display = display.padStart(decimals, "0");

    let integer = display.slice(0, display.length - decimals);
    let fraction = display.slice(display.length - decimals);

    fraction = fraction.replace(/(0+)$/, "");
    return `${negative ? "-" : ""}${integer || "0"}${
      fraction ? `.${fraction}` : ""
    }`;
  }

  return (
    <>
      <div className="verticalStack">
        <h1>Index Information</h1>
        <p>{isLoading ? "Loading..." : isError ? "Error loading data" : `Set Address: ${address ? address : 'N/A'}`}</p>
        <p>{isLoading ? "Loading..." : isError ? "Error loading data" : `Name: ${data ? data[0] : 'N/A'}`}</p>
        <p>{isLoading ? "Loading..." : isError ? "Error loading data" : `Symbol: ${data ? data[1] : 'N/A'}`}</p>
        <p>{isLoading ? "Loading..." : isError ? "Error loading data" : `Total Supply: ${data ? formatUnits(data[2], data[3]) : 'N/A'}`}</p>
        <p>{tokenNamesLoading ? "Loading token names..." : tokenNamesError ? "Error loading token names" : `Underlying Assets: ${tokenNames && tokenNames.map(name => name || "N/A").join(', ')}`}</p>
        <div className="indexSymbolInput">
            <h2>Enter amount of index tokens to issue/redeem</h2>
            <input
              type="text"
              placeholder="Amount"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
            />
        </div>
        <div className="buttonContainer">
        <div className="issueButton">Issue</div>
        <div className="redeemButton">Redeem</div>
      </div>
      </div>
    </>
  );
}

export default SetDetails;
