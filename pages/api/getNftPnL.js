const axios = require("axios");

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const { mintAddress, currentOwner, currentAccount } = req.body;

      const url = `https://api.helius.xyz/v1/nft-events?api-key=${HELIUS_API_KEY}`;
      const { data } = await axios.post(url, {
        query: {
          accounts: [mintAddress],
          types: ["NFT_MINT"],
        },
      });
      const mintInfo = data.result[0];
      const accountsInvolved = mintInfo.tokenTransfers[0];

      const anotherTransfer = await getRelatedTransactions(accountsInvolved.toTokenAccount)
    //   response.anotherTransfer = anotherTransfer

      const response = {
        mint: mintInfo,
        tokenAccount: accountsInvolved.toTokenAccount,
        userAccount: accountsInvolved.toUserAccount,
        anotherTransfer
      };

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
    const transactionType = "TRANSFER"
    const url = `https://api.helius.xyz/v0/addresses/${tokenAccount}/transactions?api-key=${HELIUS_API_KEY}&type=${transactionType}`
    const { data } = await axios.get(url)
    const response = data
    return response
}
