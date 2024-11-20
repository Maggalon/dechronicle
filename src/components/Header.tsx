import { useContext } from "react"
import { Metamask } from "../assets/Metamask"
import { DeChronicleContext } from "../context/DeChronicleContext"


export const Header = () => {

    const { currentAccount, connectWallet, getUserContributions, setShowProfile } = useContext(DeChronicleContext)

    return (
        <header className="flex justify-between items-center p-4">
            <div className="text-2xl font-bold">DeChronicle</div>
            <div className="flex items-center">
            {currentAccount == '' ? <button type="button" onClick={connectWallet} className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
                                    <Metamask />
                                    Connect with MetaMask
                                    </button> :
                                    <span onClick={async () => {
                                        await getUserContributions()
                                        setShowProfile(true)
                                    }} className="text-xl cursor-pointer hover:underline">{currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4)}</span>
            }
            </div>
        </header>
    )
}