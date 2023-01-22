import Header from "./components/Header";
import Footer from "./components/Footer";
import { useState } from "react";

export default function NftAnalysis() {
  const [inputAddress, setInputAddress ] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (inputAddress) => {
    if (!inputAddress) {
      setError("Mint Address is required. Please enter a valid address to proceed");
      return;
    }

    // Check whether input provided by the user is a valid address
      
    // Check whether mint address points to valid NFT

    // Call API to retrieve results

    
    setError("")
    console.log("Input Address: ", inputAddress)
    

  }
  
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
            placeholder="DsmBbu85ofdrSUrxdWRqwpUAX1J6qmofWEdWEDJKd4Jn"
            value={inputAddress}
            onChange={e => setInputAddress(e.target.value)}
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

        <div className="ktq4 flex pt-12 pb-24 mb-20 items-center justify-center mx-auto fsac4 md:px-1 px-3 w-1/2">
          
          <img src="y00t.png"></img>

          <div>
            <h3 className="pt-3 font-semibold text-lg text-white">
              y00t #1234
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              y00t is the second collection released by Degods Labs, The leading NFT Collection on Solana.
              Lorem ipsum ..
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
