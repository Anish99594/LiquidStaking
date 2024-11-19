import { useState } from "react";
import { ethers } from "ethers";
import Wallet from "./wallet/Wallet";
//import './StakeXFI.css';
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import {
  STAKE_TOKEN_ABI,
  STAKE_TOKEN_ADDRESS,
  STAKING_ABI,
  STAKING_ADDRESS,
} from "./abi/constants";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "./blockchain/config";
import toast from "react-hot-toast";
import "./App.css";

function App() {
  //const [walletAddress, setWalletAddress] = "";
  const [amount, setAmount] = useState("");
  const [withDraw, setWithDraw] = useState("");
  //const [balance, setBalance] = useState("");
  const { isDisconnected, address } = useAccount();
  const { data: stakeSTKBalance, refetch: refetchStakeSTKBalance } =
    useReadContract({
      abi: STAKE_TOKEN_ABI,
      functionName: "balanceOf",
      address: STAKE_TOKEN_ADDRESS,
      args: [address],
      watch: true,
    });
  const { data: STKStaked, refetch: refetchStkStaked } = useReadContract({
    abi: STAKING_ABI,
    functionName: "stakedBalance",
    address: STAKING_ADDRESS,
    args: [address],
    watch: true,
  });

  const { writeContractAsync } = useWriteContract();

  const handleStakeToken = async () => {
    //Implement staking logic here
    const approveSuccess = await handleApprove();

    if (!approveSuccess) {
      return;
    }

    await toast.promise(
      (async () => {
        const stakeHash = await writeContractAsync({
          abi: STAKING_ABI,
          functionName: "stake",
          address: STAKING_ADDRESS,
          args: [parseInt(amount) * 10 ** 18],
        });

        await waitForTransactionReceipt(config, {
          hash: stakeHash,
          pollingInterval: 1000,
          confirmations: 3,
        });
      })(),
      {
        error: "Error staking",
        loading: "Staking",
        success: "Staked",
      }
    );

    await refetchStakeSTKBalance();
    await refetchStkStaked();
  };

  const handleApprove = async () => {
    await toast.promise(
      (async () => {
        const approveHash = await writeContractAsync({
          abi: STAKE_TOKEN_ABI,
          functionName: "approve",
          address: STAKE_TOKEN_ADDRESS,
          args: [STAKING_ADDRESS, parseInt(amount) * 10 ** 18],
        });

        await waitForTransactionReceipt(config, {
          hash: approveHash,
          pollingInterval: 1000,
        });
      })(),
      {
        error: "Error approving",
        loading: "Approving",
        success: "Approved",
      }
    );
    return true;
  };

  const handleWithdraw = async () => {
    // Implement withdrawal logic here
    const confirmation = window.confirm(
      "Are you sure you want to withdraw? Early withdrawals will cause 10% of penalty"
    );

    if (!confirmation) {
      return;
    }

    await toast.promise(
      async () => {
        const withdrawHash = await writeContractAsync({
          abi: STAKING_ABI,
          functionName: "withdrawStakedTokens",
          address: STAKING_ADDRESS,
          args: [parseInt(withDraw) * 10 ** 18],
        });

        await waitForTransactionReceipt(config, {
          hash: withdrawHash,
          pollingInterval: 1000,
        });

        await Promise.all([refetchStakeSTKBalance(), refetchStkStaked()]);
      },
      {
        error: "Error withdrawing",
        loading: "Withdrawing",
        success: "Withdrawn",
      }
    );
  };

  // const handleGetToken = async () => {
  //   // Implement token retrieval logic here
  //   await toast.promise((async () => {
  //     const hash = await writeContractAsync({ abi: STAKE_TOKEN_ABI, functionName: "transferToken", address: STAKE_TOKEN_ADDRESS });
  //     await waitForTransactionReceipt(config, {
  //       hash,
  //       pollingInterval: 1000,
  //       confirmations: 2
  //     })
  //   })(), {
  //     error: "Error retrieving token",
  //     loading: "Retrieving token",
  //     success: "Token retrieved",
  //   })
  // }
  async function requestAccount() {
    if (window.ethereum) {
      console.log("detected");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (error) {
        console.log("Error Connecting");
      }
    } else {
      alert("Meta mask not detected!");
    }
  }

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.provider.Web3Provider(window.ethereum);
    }
  }

  const handleBalance = (data) => {
    setBalance(data);
  };

  return (
    <>
      <Wallet sendWalletBalance={handleBalance} />
      <div className="card">
        <h1>
          <span>The most secure liquid staking platform</span>
          Stake, earn, and manage your assets seamlessly with access to over 600
          cryptocurrencies.
        </h1>

        <div className="login-box">
          <form>
            <div className="user-box">
              <input
                type="text"
                name=""
                required=""
                onChange={(e) => setAmount(e.target.value)}
              />
              <label>Stake XFI</label>
            </div>
            <center>
              <a href="#" onClick={handleStakeToken} disabled={isDisconnected}>
                STAKE
                <span></span>
              </a>
            </center>
            <div className="user-box">
              <input
                type="text"
                name=""
                required=""
                onChange={(e) => setWithDraw(e.target.value)}
              />
              <label>Withdraw XFI</label>
            </div>
            <center>
              <a href="#" onClick={handleWithdraw} disabled={isDisconnected}>
                WITHDRAW
                <span></span>
              </a>
            </center>
            <div className="balance">
              <label>
                Stake XFI - Your balance:{" "}
                {parseInt(stakeSTKBalance) / 10 ** 18 || 0}
              </label>
              <label>
                Withdraw XFI - Amount Staked:{" "}
                {parseInt(stakeSTKBalance) / 10 ** 18 || 0}
              </label>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
