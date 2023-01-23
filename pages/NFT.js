import Header from "./components/Header";
import Footer from "./components/Footer";
import { useState } from "react";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount, getMint } from "@solana/spl-token";

export default function NftAnalysis() {
  const [inputAddress, setInputAddress] = useState("");
  const [error, setError] = useState("");
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [submit, setSubmit] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [attributes, setAttributes] = useState([]);

  const rpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC_URL;
  const connection = new Connection(rpcUrl);

  const handleSubmit = async (inputAddress) => {
    setLoadingMetadata(true);
    setSubmit(false);
    if (!inputAddress) {
      setError(
        "Mint Address is required. Please enter a valid address to proceed"
      );
      setLoadingMetadata(false);
      return;
    }
    try {
      const mintAddress = new PublicKey(inputAddress);
      const result = await getNftInfo(mintAddress);
      console.log("getNftInfo Result ", result);
      setError("");
      setLoadingMetadata(false);
      setSubmit(true);

      await processNft(mintAddress);
    } catch (err) {
      setError(
        "Input Provided is not a valid Solana Address. Please enter a valid address to proceed"
      );
      setLoadingMetadata(false);
      return;
    }
  };

  const processNft = async (mintAddress) => {
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

      // const response = await fetch(`/api/getNftPnL`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ mintAddress, currentOwner, currentAccount }),
      // });

      // const data = await response.json();
      // console.log("API result ", data);
      console.log("API Call ended");
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
        <h2 className="pt-40 mb-1 text-2xl font-semibold tracking-tighter text-center text-gray-200 lg:text-7xl md:text-6xl">
          NFT Profit and Loss Analysis
        </h2>
        <br></br>
        <p className="mx-auto text-xl text-center text-gray-300 font-normal leading-relaxed fs521 lg:w-2/3">
          Input NFT Mint Account: Coming Soon (Provide collection Name & NFT ID)
        </p>

        <div className="mt-6 mb-6 flex flex-col items-center justify-center mx-auto">
          <label
            id="success"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            Mint Address
          </label>
          <input
            type="text"
            className="bg-gray-500 border font-semibold border-white-500 text-black placeholder-gray-700 text-sm rounded-lg focus:ring-blue-500 block w-1/3 p-2.5 dark:bg-gray-700"
            placeholder="5wYwLfsqQrydNj4C7eQdK7VSU32Dkh5HHuxk6NDabr7V"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
          <button
            className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 
          overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-600
          to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white text-white 
          focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 mt-5"
            onClick={() => handleSubmit(inputAddress)}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Submit
            </span>
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {submit && (
          <div className="ktq4 flex pt-12 pb-24 mb-20 items-center justify-center mx-auto fsac4 md:px-2 px-3 w-1/2">
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
        {loadingMetadata && (
          <div className="container flex flex-col items-center justify-center mx-auto w-1/4">
            <img src="loading.gif" />
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
