import { ethers } from 'ethers'
import ABI from './abi.json'

export const getDeChronicleContract = async () => {
    
    const contractAddress = "0xaEaA946510AC1B6998fF0cc1548Bba5e1CaBf726"

    const { ethereum } = window;
    
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = provider.getSigner()
    const deChronicleContract = new ethers.Contract(contractAddress, ABI, signer)

    return deChronicleContract
    
    
}