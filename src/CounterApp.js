import React, { useState } from "react";
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
  const [txStatus, setTxStatus] = useState(""); // statusmelding
  const contractAddress = process.env.REACT_APP_COUNTER_ADDRESS;

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);
      const s = await ethProvider.getSigner();
      setSigner(s);
      const addr = await s.getAddress();
      setAddress(addr);
    } catch (err) {
      console.error(err);
      setTxStatus("Wallet connection failed ❌");
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setSigner(null);
    setProvider(null);
    setAddress(null);
    setTxStatus("");
  };

  // Copy address
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setTxStatus("Address copied to clipboard ✅");
      setTimeout(() => setTxStatus(""), 2000); // reset na 2s
    }
  };

  // Get counter value
  const getNumber = async () => {
    if (!provider) return;
    try {
      setTxStatus("Fetching counter... ⏳");
      const contract = new ethers.Contract(contractAddress, counterAbi, provider);
      const value = await contract.number();
      setCounter(value.toString());
      setTxStatus("Counter fetched ✅");
      setTimeout(() => setTxStatus(""), 2000); // reset na 2s
    } catch (err) {
      console.error(err);
      setTxStatus("Failed to fetch counter ❌");
    }
  };

  // Increment counter
  const increment = async () => {
    if (!signer) return;
    try {
      const contract = new ethers.Contract(contractAddress, counterAbi, signer);
      setTxStatus("Transaction pending... ⏳");
      const tx = await contract.increment();
      await tx.wait();
      setTxStatus("Increment successful ✅");
      getNumber();
      setTimeout(() => setTxStatus(""), 2000);
    } catch (err) {
      console.error(err);
      setTxStatus("Increment failed ❌");
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
      marginBottom: "15px",
    },
    txStatus: {
      fontSize: "1rem",
      color: "#0A0B0D",
      marginBottom: "15px",
      minHeight: "24px",
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
            <div style={styles.address}>
              Connected: {address}{" "}
              <button
                onClick={copyAddress}
                style={{ ...styles.button, padding: "6px 12px", fontSize: "0.8rem" }}
              >
                Copy
              </button>
            </div>
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
        <p style={styles.txStatus}>{txStatus}</p>

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
