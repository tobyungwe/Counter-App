import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// ABI van jouw Counter contract
const counterAbi = [
  "function number() view returns (uint256)",
  "function increment()"
];

export default function CounterApp() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [counter, setCounter] = useState(0);
  const contractAddress = process.env.REACT_APP_COUNTER_ADDRESS;

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(ethProvider);
        const s = await ethProvider.getSigner();
        setSigner(s);
      } else {
        console.log("Please install MetaMask!");
      }
    }
    init();
  }, []);

  const getNumber = async () => {
    if (!provider) return;
    const contract = new ethers.Contract(contractAddress, counterAbi, provider);
    const value = await contract.number();
    setCounter(value.toString());
  };

  const increment = async () => {
    if (!signer) return;
    const contract = new ethers.Contract(contractAddress, counterAbi, signer);
    const tx = await contract.increment();
    await tx.wait();
    getNumber();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Counter App</h1>
      <p>Current Number: {counter}</p>
      <button onClick={getNumber} style={{ marginRight: "10px" }}>Get Number</button>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
