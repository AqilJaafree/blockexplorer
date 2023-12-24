import React, { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import "./App.css";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockInfo, setBlockInfo] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getBlockNumber() {
      
        const number = await alchemy.core.getBlockNumber();
        setBlockNumber(number);
     
    }

    getBlockNumber();
  }, []);

  async function fetchBlockInfo() {
    setIsLoading(true);
    try {
      const blockTagOrHash = userInput || "latest";
      const info = await alchemy.core.getBlock(blockTagOrHash);
      setBlockInfo(info);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching block info:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="App">
      <h1>Block Explorer</h1>
      <p>Current Block Number: {blockNumber}</p>

      <div>
        <input
          type="text"
          placeholder="Enter block number or hash"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button onClick={fetchBlockInfo}>Fetch Block Info</button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        blockInfo && (
          <div>
            <h2>Block Info</h2>
            <pre>{JSON.stringify(blockInfo, null, 2)}</pre>
          </div>
        )
      )}
    </div>
  );
}

export default App;
