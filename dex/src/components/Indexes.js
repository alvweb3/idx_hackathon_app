import React, { useEffect, useState } from 'react';
import { useContractRead, useContractReads } from 'wagmi';
import { Link } from 'react-router-dom';
import { BasicIssuanceModule, Controller, Erc20, SetToken } from '../abis';

function Indexes(props) {
  const { address, isConnected } = props;
  const setTokenAddress = "0xa4c8d221d8BB851f83aadd0223a8900A6921A349";

  // Read the list of sets
  const {
    data: sets,
    isError: isErrorSets,
    isLoading: isLoadingSets,
  } = useContractRead({
    abi: Controller,
    address: setTokenAddress,
    functionName: "getSets",
  });

  // State to store contracts for useContractReads
  const [contracts, setContracts] = useState([]);

  // Update contracts whenever sets data changes
  useEffect(() => {
    if (sets && sets.length > 0) {
      const newContracts = sets
        .map((set) => [
          {
            abi: SetToken,
            address: set,
            functionName: "name",
          },
          {
            abi: SetToken,
            address: set,
            functionName: "symbol",
          },
          {
            abi: SetToken,
            address: set,
            functionName: "totalSupply",
          },
          {
            abi: SetToken,
            address: set,
            functionName: "decimals",
          },
          {
            abi: SetToken,
            address: set,
            functionName: "getComponents",
          },
        ])
        .flat();
      setContracts(newContracts);
    }
  }, [sets]);

  // Fetch properties for all sets
  const {
    data: setProperties,
    isError: isErrorSetProperties,
    isLoading: isLoadingSetProperties,
  } = useContractReads({
    contracts,
  });

  function moveDecimal(number1, number2) {
    // Move the decimal by dividing the first number by 10 raised to the power of the second number
    var result = number1 / Math.pow(10, number2);
    // Round to two decimal places
    result = Math.round(result * 100) / 100;
    return result;
  }

  return (
    <>
      <div className="verticalStack">
        {!isConnected ? (
          <div className="connectButton">You are not logged in</div>
        ) : (
          <>
            {isLoadingSets ? (
              <p>Loading...</p>
            ) : isErrorSets ? (
              <p>Error loading sets data</p>
            ) : (
              sets.map((set, index) => (
                <Link className='link' to={`/set/${set}`} key={index}>
                  <div className="propertyCard">
                    <p>Set address: {set}</p>
                    <p>
                      Properties:{" "}
                      {setProperties && setProperties.length > index * 5
                        ? `${setProperties[index * 5]} - ${
                            setProperties[index * 5 + 1]
                          } - ${moveDecimal(
                            setProperties[index * 5 + 2],
                            setProperties[index * 5 + 3]
                          )}`
                        : "Loading..."}
                    </p>
                  </div>
                </Link>
              ))
            )}

            <p>
              {isLoadingSetProperties
                ? "Loading properties..."
                : isErrorSetProperties
                ? "Error loading properties data"
                : ""}
            </p>
          </>
        )}
      </div>
    </>
  );
  
}

export default Indexes;