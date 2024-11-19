import React, { useState } from "react";
import { ethers } from "ethers";
import "../wallet/wallet.css";

const Wallet = ({ sendWalletBalance }) => {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
        });
    } else {
      setErrorMessage("Install Metamask");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getUserBalance(newAccount.toString());
  };

  const getUserBalance = (address) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        if (balance) {
          console.log("Raw balance (wei):", balance);

          // Format the balance to ether
          const formattedBalance = ethers.formatEther(balance);

          // Update state with the formatted balance
          setUserBalance(formattedBalance);

          // Pass the formatted balance directly to the parent
          sendWalletBalance(formattedBalance);

          console.log("Formatted balance (ether):", formattedBalance);
        } else {
          console.error("Failed to fetch balance:", balance);
        }
      })
      .catch((error) => {
        console.error("Error fetching balance:", error);
      });
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  return (
    <button
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        padding: "10px 20px",
        backgroundColor: "#03f40f",
        color: "white",
        border: "none",
        borderRadius: "5px",
      }}
      onClick={connectWalletHandler}
    >
      {defaultAccount === null
        ? "Connect"
        : defaultAccount.slice(0, 6) + "...." + defaultAccount.slice(-4)}
    </button>
  );
};

export default Wallet;
