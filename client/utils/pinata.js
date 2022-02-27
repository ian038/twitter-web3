import axios from 'axios'

const key = process.env.NEXT_PUBLIC_PINATA_API_KEY
const secret = process.env.NEXT_PUBLIC_PINATA_API_SECRET

export const pinJSONToIPFS = async json => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

    try {
        const res = await axios.post(url, json, {
          headers: {
            pinata_api_key: key,
            pinata_secret_api_key: secret
          }
        })
        return res.data.IpfsHash
    } catch(error) {
        console.log('JSON to IPFS error', error)
    }
}
  
export const pinFileToIPFS = async (file, pinataMetaData) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
  
    let data = new FormData()
  
    data.append('file', file)
    data.append('pinataMetadata', JSON.stringify(pinataMetaData))

    try {
        const res = await axios.post(url, data, {
          maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            pinata_api_key: key,
            pinata_secret_api_key: secret
          }
        })
        return res.data.IpfsHash
    } catch(error) {
        console.log('File to IPFS error', error)
    }
}