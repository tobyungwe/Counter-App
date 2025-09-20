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
  const [address, setAddress] = useState(null);
  const [counter, setCounter] = useState(0);
  const contractAddress = process.env.REACT_APP_COUNTER_ADDRESS;

  // Connect wallet functie
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);
      const s = await ethProvider.getSigner();
      setSigner(s);
      const addr = await s.getAddress();
      setAddress(addr);
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  // Disconnect wallet (simpele manier: reset state)
  const disconnectWallet = () => {
    setSigner(null);
    setProvider(null);
    setAddress(null);
  };

  // Get counter value
  const getNumber = async () => {
    if (!provider) return;
    try {
      const contract = new ethers.Contract(contractAddress, counterAbi, provider);
      const value = await contract.number();
      setCounter(value.toString());
    } catch (err) {
      console.error(err);
    }
  };

  // Increment counter
  const increment = async () => {
    if (!signer) return;
    try {
      const contract = new ethers.Contract(contractAddress, counterAbi, signer);
      const tx = await contract.increment();
      await tx.wait();
      getNumber();
    } catch (err) {
      console.error(err);
    }
  };

  // Coinbase-blauwe styling
  const styles = {
    container: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#FFFFFF",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: "20px",
      padding: "50px 40px",
      boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
      textAlign: "center",
      maxWidth: "450px",
      width: "100%",
    },
    header: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#0052FF",
      marginBottom: "15px",
    },
    address: {
      fontSize: "1rem",
      marginBottom: "20px",
      color: "#0A0B0D",
      wordBreak: "break-word",
    },
    counter: {
      fontSize: "3rem",
      fontWeight: "700",
      color: "#0A0B0D",
      marginBottom: "25px",
    },
    button: {
      backgroundColor: "#0052FF",
      color: "white",
      border: "none",
      padding: "14px 28px",
      margin: "10px",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.header}>My Counter on Base</h1>

        {/* Connect / Disconnect */}
        {!address ? (
          <button
            style={styles.button}
            onClick={connectWallet}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = "#0041C4")}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = "#0052FF")}
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div style={styles.address}>Connected: {address}</div>
            <button
              style={styles.button}
              onClick={disconnectWallet}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = "#0041C4")}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = "#0052FF")}
            >
              Disconnect
            </button>
          </>
        )}

        {/* Counter */}
        <p style={styles.counter}>{counter}</p>
        <div>
          <button
            style={styles.button}
            onClick={getNumber}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = "#0041C4")}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = "#0052FF")}
            disabled={!provider}
          >
            Get Number
          </button>
          <button
            style={styles.button}
            onClick={increment}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = "#0041C4")}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = "#0052FF")}
            disabled={!signer}
          >
            Increment
          </button>
        </div>
      </div>
    </div>
  );
}
