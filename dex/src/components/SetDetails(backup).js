import React, { useEffect, useState } from 'react';
import { useContractRead, useContractReads, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useParams } from 'react-router-dom';
import { Erc20, SetToken, BasicIssuanceModule } from '../abis';
import { BigNumber, utils, ethers } from 'ethers';
import bigInt from "big-integer";

function SetDetails(props) {
  const { userWallet, isConnected } = props;
  const { address } = useParams(); // Get the address from the URL
  const [tokenAmount, setTokenAmount] = useState(1);
  const [approvalPosition, setApprovalPosition] = useState(0);
  const [tokenContracts, setTokenContracts] = useState([]);
  const [stateComponentDecimals, setStateComponentDecimals] = useState([]);

  const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
  const basicIssuanceModuleAddress = "0x689Fb32D4197249639441CAaD53cfa73454dC19e";

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      { abi: SetToken, address: address, functionName: 'name' },
      { abi: SetToken, address: address, functionName: 'symbol' },
      { abi: SetToken, address: address, functionName: 'totalSupply' },
      { abi: SetToken, address: address, functionName: 'decimals' },
      { abi: SetToken, address: address, functionName: 'getComponents' },
    ],
  });

  useEffect(() => {
    if (data && data[4] && data[4].length) {
      setTokenContracts(data[4].map((tokenAddress) => ({
        abi: Erc20,
        address: tokenAddress,
        functionName: 'name'
      })));
    }
  }, [data]);

  const { data: tokenNames, isLoading: tokenNamesLoading, isError: tokenNamesError } = useContractReads({
    contracts: tokenContracts
  });

  useEffect(() => {
    if (data && data[4] && data[4].length) {
      setStateComponentDecimals(data[4].map((tokenAddress) => ({
        abi: Erc20,
        address: tokenAddress,
        functionName: 'decimals'
      })));
    }
  }, [data]);

  const { data: tokenDecimals, isLoading: tokenDecimalsLoading, isError: tokenDecimalsError } = useContractReads({
    contracts: stateComponentDecimals
  });

  // console.log("Data: ", data);
  // console.log("TOKEN DECIMALS: ", tokenDecimals);
  // console.log("TOKEN Names: ", tokenNames);

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

  function parseUnits(value, decimals) {
    if (value === undefined || decimals === undefined) return bigInt(0);

    let [integer, fraction = '0'] = value.split('.');
  
    const negative = integer.startsWith('-');
    if (negative) {
      integer = integer.slice(1);
    }
  
    // Trim trailing zeros from fraction.
    fraction = fraction.replace(/(0+)$/, '');
  
    // Round off if the fraction is longer than the specified number of decimals.
    if (decimals === 0) {
      if (Math.round(Number(`.${fraction}`)) === 1) {
        integer = `${bigInt(integer) + 1n}`;
      }
      fraction = '';
    } else if (fraction.length > decimals) {
      const [left, unit, right] = [
        fraction.slice(0, decimals - 1),
        fraction.slice(decimals - 1, decimals),
        fraction.slice(decimals),
      ];
  
      const rounded = Math.round(Number(`${unit}.${right}`));
      if (rounded > 9) {
        fraction = `${bigInt(left) + 1n}0`.padStart(left.length + 1, '0');
      } else {
        fraction = `${left}${rounded}`;
      }
  
      if (fraction.length > decimals) {
        fraction = fraction.slice(1);
        integer = `${bigInt(integer) + 1n}`;
      }
  
      fraction = fraction.slice(0, decimals);
    } else {
      fraction = fraction.padEnd(decimals, '0');
    }
  
    return bigInt(`${negative ? '-' : ''}${integer}${fraction}`);
  }

  /*
  // GET COMPONENTS AND UNITS FOR APPROVAL
  const { data: componentUnits } = useContractRead({
    address: basicIssuanceModuleAddress,
    abi: BasicIssuanceModule,
    functionName: 'getRequiredComponentUnitsForIssue',
    args: [address, ethers.utils.parseEther(`${tokenAmount}`)],
  });
  */

 

  // -----------------------------------------

  /*
  const { config: initializeConfig } = usePrepareContractWrite({
    address: basicIssuanceModuleAddress,
    abi: BasicIssuanceModule,
    functionName: 'initialize',
    args: [address, ADDRESS_ZERO]
  })

  const { write: initialize } = useContractWrite(initializeConfig);*/

  const { config: config1 } = usePrepareContractWrite({
    address: data[4][approvalPosition],
    abi: Erc20,
    functionName: 'approve',
    args: [basicIssuanceModuleAddress, parseUnits("1", stateComponentDecimals[approvalPosition])],
  });

  const { data: approval1, isSuccess: isSuccess1, write: approve } = useContractWrite(config1);

  const { config: config3 } = usePrepareContractWrite({
    address: basicIssuanceModuleAddress,
    abi: BasicIssuanceModule,
    functionName: 'issue',
    args: [address, ethers.utils.parseEther(`${tokenAmount}`), userWallet]
  })
  
  const { data: issueData,  isSuccess: isSuccess3, write: issue } = useContractWrite(config3)

  const { config: config4 } = usePrepareContractWrite({
    address: basicIssuanceModuleAddress,
    abi: BasicIssuanceModule,
    functionName: 'redeem',
    args: [address, ethers.utils.parseEther(`${tokenAmount}`), userWallet],
  })
  
  const { data: redeemData,  isSuccess: isSuccess4, write: redeem } = useContractWrite(config4)

  const handleInputChangeAmount = (event) => {
    const { value } = event.target;
    setTokenAmount(value === null ? 0 : value);
  };

  const handleInputChangeApproval = (event) => {
    const { value } = event.target;
    setApprovalPosition(value === null ? 0 : value);
  };

  return (
    <>
      <div className="verticalStack">
        <h1>Index Information</h1>
        {/*<div className="issueButton" onClick={() => initialize?.()}>Initialize</div>*/}
        <p>{isLoading ? "Loading..." : isError ? "Error loading data" : `Set Address: ${address ? address : 'N/A'}`}</p>
        <p>{isLoading ? "Loading..." : isError ? "Error loading data" : `Name: ${data ? data[0] : 'N/A'}`}</p>
        <p>{isLoading ? "Loading..." : isError ? "Error loading data" : `Symbol: ${data ? data[1] : 'N/A'}`}</p>
        <p>{isLoading ? "Loading..." : isError ? "Error loading data" : `Total Supply: ${data ? formatUnits(data[2], data[3]) : 'N/A'}`}</p>
        <p>{tokenNamesLoading ? "Loading token names..." : tokenNamesError ? "Error loading token names" : `Underlying Assets: ${tokenNames && tokenNames.map(name => name || "N/A").join(', ')}`}</p>
        <div className="indexSymbolInput">
            <h2>Enter amount of index tokens to issue/redeem</h2>
            <input
              type="number"
              placeholder="Amount"
              value={tokenAmount}
              onChange={handleInputChangeAmount}
            />
        </div>
        <div className="indexSymbolInput">
            <h2>Enter position of token to approve</h2>
            <input
              type="number"
              placeholder="Amount"
              value={approvalPosition}
              onChange={handleInputChangeApproval}
            />
        </div>
        <div className="buttonContainer">
        <div className="issueButton" onClick={() => approve?.()}>Approve</div>
        <div className="issueButton" onClick={() => issue?.()}>Issue</div>
        <div className="redeemButton" onClick={() => redeem?.()}>Redeem</div>
  </div>
      </div>
    </>
  );
}

export default SetDetails;
