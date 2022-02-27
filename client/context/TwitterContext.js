import { createContext, useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'

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

    const checkIfWalletConnected = async () => {
        if(!window.ethereum) return setAppStatus('noMetaMask')

        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
            if(accounts.length > 0) {
                setAppStatus('connected')
                setCurrentAccount(accounts[0])

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
            } else {
                router.push('/')
                setAppStatus('notConnected')
            }
        } catch (error) {
            setAppStatus('error')
        }
    }

    const value = { connectWallet, appStatus, currentAccount }

    return (
        <TwitterContext.Provider value={value}>
            {children}
        </TwitterContext.Provider>
    )
}

export const useTwitterContext = () => useContext(TwitterContext)