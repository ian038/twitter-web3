import { createContext, useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { client } from '../utils/sanity'

export const TwitterContext = createContext()

export const TwitterProvider = ({ children }) => {
    const [appStatus, setAppStatus] = useState('')
    const [currentAccount, setCurrentAccount] = useState('')
    const [currentUser, setCurrentUser] = useState({})
    const [tweets, setTweets] = useState([])
    const router = useRouter()

    useEffect(() => {
        checkIfWalletConnected()
    }, [])

    useEffect(() => {
        if (!currentAccount && appStatus == 'connected') return
        getCurrentUserDetails(currentAccount)
        fetchTweets()
    }, [currentAccount, appStatus])

    const checkIfWalletConnected = async () => {
        if(!window.ethereum) return setAppStatus('noMetaMask')

        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
            if(accounts.length > 0) {
                setAppStatus('connected')
                setCurrentAccount(accounts[0])
                createUserAccount(accounts[0])
            } else {
                router.push('/')
                setAppStatus('notConnected')
            }
        } catch(error) {
            router.push('/')
            setAppStatus('error')
        }
    }

    const connectWallet = async () => {
        if (!window.ethereum) return setAppStatus('noMetaMask')

        try {
            setAppStatus('loading')    
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            if(accounts.length > 0) {
                setCurrentAccount(accounts[0])
                createUserAccount(accounts[0])
            } else {
                router.push('/')
                setAppStatus('notConnected')
            }
        } catch (error) {
            setAppStatus('error')
        }
    }

    const createUserAccount = async currentAccount => {
        if (!window.ethereum) return setAppStatus('noMetaMask')
        try {
          const userDoc = {
            _type: 'users',
            _id: currentAccount,
            name: 'Unnamed',
            isProfileImageNft: false,
            profileImage: 'https://about.twitter.com/content/dam/about-twitter/en/brand-toolkit/brand-download-img-1.jpg.twimg.1920.jpg',
            walletAddress: currentAccount
          }
    
          await client.createIfNotExists(userDoc)
    
          setAppStatus('connected')
        } catch (error) {
          router.push('/')
          setAppStatus('error')
        }
    }

    const getNftProfileImage = async (imageUri, isNft) => {
        if (isNft) {
          return `https://gateway.pinata.cloud/ipfs/${imageUri}`
        } else if (!isNft) {
          return imageUri
        }
    }

    const getCurrentUserDetails = async (userAccount = currentAccount) => {
        if (appStatus !== 'connected') return
    
        const query = `
          *[_type == "users" && _id == "${userAccount}"]{
            "tweets": tweets[]->{timestamp, tweet}|order(timestamp desc),
            name,
            profileImage,
            isProfileImageNft,
            coverImage,
            walletAddress
          }
        `
        const response = await client.fetch(query)
    
        const profileImageUri = await getNftProfileImage(response[0].profileImage, response[0].isProfileImageNft)
    
        setCurrentUser({
          tweets: response[0].tweets,
          name: response[0].name,
          profileImage: profileImageUri,
          walletAddress: response[0].walletAddress,
          coverImage: response[0].coverImage,
          isProfileImageNft: response[0].isProfileImageNft
        })
    }

    const fetchTweets = async () => {
        const query = `
          *[_type == "tweets"]{
            "author": author->{name, walletAddress, profileImage, isProfileImageNft},
            tweet,
            timestamp
          }|order(timestamp desc)
        `    
        const sanityResponse = await client.fetch(query)
    
        setTweets([])
    
        sanityResponse.forEach(async item => {
          const profileImageUrl = await getNftProfileImage(item.author.profileImage, item.author.isProfileImageNft)
    
          if (item.author.isProfileImageNft) {
            const newItem = {
              tweet: item.tweet,
              timestamp: item.timestamp,
              author: {
                name: item.author.name,
                walletAddress: item.author.walletAddress,
                profileImage: profileImageUrl,
                isProfileImageNft: item.author.isProfileImageNft
              }
            }
    
            setTweets(prevState => [...prevState, newItem])
          } else {
            setTweets(prevState => [...prevState, item])
          }
        })
    }

    const value = { connectWallet, appStatus, currentAccount, currentUser, getCurrentUserDetails, fetchTweets, tweets }

    return (
        <TwitterContext.Provider value={value}>
            {children}
        </TwitterContext.Provider>
    )
}

export const useTwitterContext = () => useContext(TwitterContext)