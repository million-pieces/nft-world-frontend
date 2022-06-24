import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import Auction from "@/build/abis/Auction.json";
import Airdrop from "@/build/abis/Airdrop.json";
import MillionPieces from "@/build/abis/MillionPieces.json";
import MultiSend from "@/build/abis/MultiSend.json";
import Piece from "@/build/abis/Piece.json";
import SegmentsAirdrop from "@/build/abis/SegmentsAirdrop.json";
import PieceBalance from "@/build/abis/PieceBalance.json";

import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";
import Fortmatic from "fortmatic";

export default (ctx, inject) => {
  let provider;
  let providerName;
  const web3obj = new Web3(new Web3.providers.HttpProvider(`https://${process.env.NETWORK}.infura.io/v3/${process.env.INFURA_KEY}`));

  const interval = setInterval(async () => {
    try {
      provider = await detectEthereumProvider({timeout: 1000});

      if (provider) {
        web3obj.setProvider(provider);
        clearInterval(interval);
      }
    } catch (e) {
      // console.error(e);
    }
  }, 1500);

  const web3 = () => {
    return web3obj;
  };

  const ethereum = () => {
    return provider;
  };

  const $contracts = {
    auction: () => new web3obj.eth.Contract(Auction, process.env.AUCTION_ADDRESS),
    airdrop: () => new web3obj.eth.Contract(Airdrop, process.env.AIRDROP_ADDRESS),
    millionPieces: () => new web3obj.eth.Contract(MillionPieces, process.env.MILLION_PIECES_ADDRESS),
    multiSend: () => new web3obj.eth.Contract(MultiSend, process.env.MILTI_SEND_ADDRESS),
    piece: () => new web3obj.eth.Contract(Piece, process.env.PIECE_ADDRESS),
    segmentsAirdrop: () => new web3obj.eth.Contract(SegmentsAirdrop, process.env.SEGMENTS_AIRDROP),
    pieceBalance: () => new web3obj.eth.Contract(PieceBalance, process.env.PIECE_BALANCE),
  };

  const setWeb3Provider = async (p) => {
    let providerObject;
    switch (p) {
      case "injected": {
        providerObject = window.ethereum;
        break;
      }
      case "walletlink": {
        const walletLink = new WalletLink({
          appName: "MillionPieces",
          appLogoUrl: "https://millionpieces.io/logo-icon.png",
          darkMode: true,
        });
        providerObject = walletLink.makeWeb3Provider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`, 1);
        break;
      }
      case "walletconnect": {
        providerObject = new WalletConnectProvider({
          infuraId: process.env.INFURA_KEY,
        });
        break;
      }
      case "fortmatic": {
        const fm = new Fortmatic(process.env.FORTMATIC_KEY);
        providerObject = fm.getProvider();
        break;
      }
    }

    try {
      await providerObject.enable();
      web3obj.setProvider(providerObject);

      provider = providerObject;
      providerName = p;
    } catch (error) {
      console.log("Error from web3.js:94", error);
      return;
    }
  };

  const getNetworkName = (networkId) => {
    let networkName;
    switch (networkId.toString()) {
      case "1":
        networkName = "mainnet";
        break;
      case "3":
        networkName = "ropsten";
        break;
      case "4":
        networkName = "rinkeby";
        break;
      case "5":
        networkName = "goerli";
        break;
      case "42":
        networkName = "kovan";
        break;
      case "56":
        networkName = "bsc";
        break;
      default:
        networkName = "unknown";
    }

    return networkName;
  };

  const addPieceTokens = async () => {
    if (ethereum()) {
      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum().request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: process.env.TOKEN_ADDRESS, // The address that the token is at.
              symbol: "PIECE", // A ticker symbol or shorthand, up to 5 chars.
              decimals: 18, // The number of decimals in the token
              image: "https://millionpieces.io/favicon.ico?v=1.0.0", // A string url of the token logo
            },
          },
        });

        if (wasAdded) {
          console.log("Thanks for your interest!");
        } else {
          console.log("Your loss!");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const switchChainId = async () => {
    if (providerName !== "injected") return;
    if (ethereum()) {
      // switch network to env
      const chainId = await ethereum().request({method: "eth_chainId"});
      if (chainId !== process.env.NETWORK_CHAIN_ID) {
        try {
          await ethereum().request({
            method: "wallet_switchEthereumChain",
            params: [{chainId: process.env.NETWORK_CHAIN_ID}],
          });
        } catch (error) {
          alert(`Please switch network to ${process.env.NETWORK.toUpperCase()}!`);
          console.error(error);
        }
      }
    }
  };

  const alertIfIncorrectNetwork = async (network) => {
    const selectedNetwork = getNetworkName(network);
    if (selectedNetwork !== process.env.NETWORK.toLowerCase()) {
      alert(`Please switch network to ${process.env.NETWORK.toUpperCase()}!`);

      throw new Error("INVALID NETWORK");
    }
  };

  ctx.$contracts = $contracts;
  ctx.$ethereum = ethereum;
  ctx.$web3 = web3;
  ctx.$setWeb3Provider = setWeb3Provider;
  ctx.$alertIfIncorrectNetwork = alertIfIncorrectNetwork;
  ctx.$switchChainId = switchChainId;
  ctx.$addPieceTokens = addPieceTokens;
  inject("web3", web3);
  inject("ethereum", ethereum);
  inject("contracts", $contracts);
  inject("setWeb3Provider", setWeb3Provider);
  inject("alertIfIncorrectNetwork", alertIfIncorrectNetwork);
  inject("switchChainId", switchChainId);
  inject("addPieceTokens", addPieceTokens);
};
