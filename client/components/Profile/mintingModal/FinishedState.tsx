import { useEffect, Dispatch, SetStateAction } from 'react'
import { useTwitterContext } from '../../../context/TwitterContext'
import Image from 'next/image'
import checkMark from '../../../assets/check.png'

const style = {
  wrapper: `h-[20rem] w-[35rem] text-white bg-[#15202b] rounded-3xl p-10 flex flex-col items-center justify-center`,
  title: `font-semibold text-xl mb-6`,
  closeButton: `mt-6 bg-white text-black px-3 py-1 rounded-full hover:bg-[#8899a6] cursor-pointer`
}

interface FinishedStateProps {
  setMint: Dispatch<SetStateAction<String>>
}

const FinishedState = ({ setMint }: FinishedStateProps) => {
  const { getCurrentUserDetails } = useTwitterContext()

  useEffect(() => {
    getCurrentUserDetails()
  })

  return (
    <div className={style.wrapper}>
      <div className={style.title}>Minting Successful!</div>
      <Image src={checkMark} alt='checkmark' height={100} width={100} />
      <div onClick={() => setMint("")} className={style.closeButton}>
        Close
      </div>
    </div>
  )
}

export default FinishedState