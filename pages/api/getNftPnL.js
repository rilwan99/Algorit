const axios = require("axios");

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const { mintAddress, currentOwner, currentAccount } = req.body;
      const mintInfo = await getMintTransaction(mintAddress)
      const response = {
        mintInfo,
      };
      let transactionInfo = mintInfo
      let count = 0;

      while (true) {
        let receivingTokenAccount = transactionInfo.tokenTransfers[0].toTokenAccount;
        if (receivingTokenAccount === currentAccount) {
            break;
        }
        console.log("Fetching transaction data for ", receivingTokenAccount)
        let anotherTransfer = await getRelatedTransactions(receivingTokenAccount)
        response[`iteration_${count}`] = anotherTransfer
        transactionInfo = anotherTransfer
        count++;
      } 
      res.status(200).json(response);
    } catch (err) {
      console.log("Error in getNftPnL ", err);
      res.status(404).json(err);
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

const getRelatedTransactions = async (tokenAccount) => {
    const url = `https://api.helius.xyz/v0/addresses/${tokenAccount}/transactions?api-key=${HELIUS_API_KEY}`
    const { data } = await axios.get(url)

    const transactionArray = data
    let result
    for (let i=0; i<transactionArray.length; i++) {
        let tokenAccountsInvolved = transactionArray[i].tokenTransfers
        if (tokenAccountsInvolved.length !== 0 && tokenAccountsInvolved[0].fromTokenAccount === tokenAccount) {
            result = transactionArray[i]
            break;
        } 
    }
    return result
}

const getMintTransaction = async (mintAddress) => {
    const url = `https://api.helius.xyz/v1/nft-events?api-key=${HELIUS_API_KEY}`;
    const { data } = await axios.post(url, {
      query: {
        accounts: [mintAddress],
        types: ["NFT_MINT"],
      },
    });
    const mintInfo = data.result[0];
    return mintInfo
}