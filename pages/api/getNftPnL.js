const axios = require('axios')

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

export default async function handler(req, res) {
    const mintAddress = req.query.address
    const url = `https://api.helius.xyz/v1/nft-events?api-key=${HELIUS_API_KEY}`
    const { data } = await axios.post(url, {
        query: {
            accounts: [mintAddress],
            types: ["NFT_MINT"]
        }, 
    })
    res.status(200).json({ result: data })
  }
  