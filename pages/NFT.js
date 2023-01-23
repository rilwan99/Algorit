import Header from "./components/Header";
import Footer from "./components/Footer";
import { useState } from "react";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import sample from "./sample.json";

export default function NftAnalysis() {
  const [inputAddress, setInputAddress] = useState("");
  const [error, setError] = useState("");
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const [submit, setSubmit] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [attributes, setAttributes] = useState([]);

  const [transactionHistory, setTransactionHistory] = useState([]);

  const rpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC_URL;
  const connection = new Connection(rpcUrl);

  const handleSubmit = async (inputAddress) => {
    setLoadingMetadata(true);
    setSubmit(false);
    setLoadingTransaction(true);
    setError("")

    if (!inputAddress) {
      setError(
        "Mint Address is required. Please enter a valid address to proceed"
      );
      setLoadingMetadata(false);
      setLoadingTransaction(false);
      return;
    }
    try {
      const mintAddress = new PublicKey(inputAddress);
      const nftMetadata = await getNftInfo(mintAddress);
      console.log("getNftInfo Result ", nftMetadata);
      setError("");
      setLoadingMetadata(false);
      setSubmit(true);

      const rawTransactionHistory = await getTransactionHistory(mintAddress);
      const parsedTransactionHistory = processTransactionHistory(
        rawTransactionHistory
      );
      setLoadingTransaction(false);
      setTransactionHistory(parsedTransactionHistory);
      console.log("Transaction history ", transactionHistory);
    } catch (err) {
      setError(
        "Input Provided is not a valid Solana Address. Please enter a valid address to proceed"
      );
      setLoadingMetadata(false);
      setLoadingTransaction(false);
      console.log(err);
      return;
    }
  };

  const processTransactionHistory = (rawTransactionHistory) => {
    return Object.entries(rawTransactionHistory).map(([key, item]) => {
      if (item.type === "NFT_SALE") {
        item.amount = item.events.nft.amount;
      }
      return {
        description: item.description,
        signature: item.signature,
        timestamp: convertUnixTimestamp(item.timestamp),
        slot: item.slot,
        type: item.type,
        fromTokenAccount: item.tokenTransfers[0].fromTokenAccount,
        toTokenAccount: item.tokenTransfers[0].toTokenAccount,
        fromUserAccount: item.tokenTransfers[0].fromUserAccount,
        toUserAccount: item.tokenTransfers[0].toUserAccount,
        amount: item.amount,
      };
    });
  };

  const convertUnixTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const formattedDate =
      ("0" + date.getDate()).slice(-2) +
      "/" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      date.getFullYear() +
      " " +
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2) +
      ":" +
      ("0" + date.getSeconds()).slice(-2);
    return formattedDate;
  };

  const getTransactionHistory = async (mintAddress) => {
    try {
      const largestAccounts = await connection.getTokenLargestAccounts(
        mintAddress
      );
      const largestTokenAccount = largestAccounts.value[0].address;
      const currentAccount = largestTokenAccount.toString();
      const largestAccountInfo = await connection.getParsedAccountInfo(
        largestTokenAccount
      );
      const currentOwner = largestAccountInfo.value.data.parsed.info.owner;
      console.log("Current Owner ", currentOwner);
      console.log("Token Account ", currentAccount);

      const response = await fetch(`/api/getNftTransactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mintAddress, currentOwner, currentAccount }),
      });
      const data = await response.json();

      // const data = sample;
      console.log("API result ", data);
      return data;
    } catch (err) {
      setError("An unexpected error occurred");
      console.log(err);
      return;
    }
  };

  const getNftInfo = async (inputAddress) => {
    try {
      const metaplex = new Metaplex(connection);
      const mintAddress = new PublicKey(inputAddress);
      const nft = await metaplex.nfts().findByMint({ mintAddress });

      //Set State variables
      setTitle(nft.name);
      setDescription(nft.json.description);
      setImageLink(nft.json.image);
      setAttributes(nft.json.attributes);
      return nft;
    } catch (err) {
      console.log("Error in getNFTInfo", err);
    }
  };

  return (
    <div className="text-black bg-black">
      <Header />
      <section className="text-gray-600 body-font">
        <div className="mt-40 mb-6 flex items-center justify-center space-x-5 mx-auto">
          <input
            type="text"
            className="bg-black border font-semibold border-white-500 text-white placeholder-wihte text-sm rounded-lg focus:ring-blue-500 block w-1/3 p-2.5 dark:bg-gray-700"
            placeholder="Search..."
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
          <button
            className="relative inline-flex items-center justify-center p-0.5 mr-2 
          overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-600
          to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white text-white 
          focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            onClick={() => handleSubmit(inputAddress)}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Submit
            </span>
          </button>
        </div>
        {error && <div className="flex items-center justify-center">
          <p className="text-red-500">{error}</p>
          </div>}

        {submit && (
          <div className="ktq4 flex pt-12 pb-24 mb-10 items-center justify-center mx-auto fsac4 md:px-2 px-3 w-1/2">
            <img src={imageLink}></img>

            <div>
              <h3 className="pt-3 font-semibold text-lg text-white">{title}</h3>
              <p className="pt-2 mb-4 value-text text-md text-gray-200 fkrr1">
                {description}
              </p>

              {attributes.map((trait, index) => {
                return (
                  <button
                    key={index}
                    type="button"
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  >
                    {trait.trait_type} : {trait.value}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {!submit && !loadingMetadata && (
          <div className="pt-60 pb-44 mb-5"></div>
        )}
        {loadingMetadata && (
          <div className="container flex flex-col items-center justify-center mx-auto w-1/4">
            <img src="loading.gif" />
          </div>
        )}
        {loadingTransaction && (
          <div className="container flex flex-col items-center justify-center mx-auto w-1/4">
            <img src="loading2.gif" />
          </div>
        )}
        {!loadingTransaction && (
          <div className=" flex pt-12 pb-14 items-center justify-center mx-auto fsac4 md:px-2 px-3 w-1/2">
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {transactionHistory.map((transaction, index) => {
                return (
                  <li key={index} className="mb-5 ml-6">
                    <span className="absolute flex items-center justify-center w-5 h-6 rounded-full -left-3 ring-8 ring-blue-900 bg-blue-900">
                      <h3 className="text-white font-semibold">{index + 1}</h3>
                    </span>

                    <h3 className="flex items-center mb-2 text-lg font-semibold text-white">
                      {transaction.description}
                      {!transaction.description && "Not Available"}
                      {transaction.type == "NFT_MINT" && (
                        <span className="bg-green-900 text-white text-sm font-medium mr-2 mb-6 px-2.5 py-0.5 rounded ml-3">
                          Mint
                        </span>
                      )}
                      {transaction.type == "NFT_SALE" && (
                        <span className="bg-red-900 text-white text-sm font-medium mr-2 mb-6 px-2.5 py-0.5 rounded ml-3">
                          Sale
                        </span>
                      )}
                    </h3>

                    <time className="block mb-2 text-sm font-normal leading-none text-gray-300">
                      {transaction.timestamp}
                    </time>

                    <div className="flex items-center">
                      <p className="mb-1 text-base font-semibold text-gray-400">
                        Signature:
                      </p>
                      <a
                        className="hover:text-blue-200 mb-1 ml-2 text-base font-normal text-gray-400"
                        href={`https://solana.fm/tx/${transaction.signature}?cluster=mainnet-qn1`}
                      >
                        {transaction.signature}
                      </a>
                    </div>

                    <div className="flex items-center">
                      <p className="mb-1 text-base font-semibold text-gray-400">
                        User Account:
                      </p>
                      <p className="mb-1 ml-2 text-base font-normal text-gray-400">
                        {transaction.toUserAccount}
                        {!transaction.toUserAccount && "Not Available"}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <p className="mb-1 text-base font-semibold text-gray-400">
                        Token Account:
                      </p>
                      <p className="mb-1 ml-2 text-base font-normal text-gray-400">
                        {transaction.toTokenAccount}
                      </p>
                    </div>
                    {transaction.type == "NFT_MINT" && (
                      <span className="bg-blue-900 text-white text-sm font-medium mb-6 px-2.5 py-0.5 rounded">
                        {transaction.amount / LAMPORTS_PER_SOL} SOL
                      </span>
                    )}
                    {transaction.type == "NFT_SALE" && (
                      <span className="bg-blue-900 text-white text-sm font-medium mb-6 px-2.5 py-0.5 rounded">
                        {transaction.amount / LAMPORTS_PER_SOL} SOL
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
