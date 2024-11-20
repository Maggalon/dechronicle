import { createContext, useEffect, useState } from "react";
import { ethers } from 'ethers';
import { pinata } from "../utils/config";

import ABI from '../utils/DeChronicle.json'

export const DeChronicleContext = createContext();

const { ethereum } = window;

export const DeChronicleProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('')
    const [showTextEditor, setShowTextEditor] = useState<boolean>(false);
    const [showFileUpload, setShowFileUpload] = useState<boolean>(false);
    const [fileType, setFileType] = useState<string>("")
    const [deChronicleContract, setDeChronicleContract] = useState()
    const [contractOwner, setContractOwner] = useState<string>("")
    const [userContributionsId, setUserContributionsId] = useState<string>("")
    const [userContributions, setUserContributions] = useState()
    const [showProfile, setShowProfile] = useState<boolean>(false)


    const handleShowTextEditor = () => {
        setShowTextEditor(!showTextEditor)
    }

    const handleShowFileUpload = (fileType: string) => {
        setShowFileUpload(!showFileUpload)
        setFileType(fileType)
    }

    const getUserContributions = async () => {

        console.log(`Getting the latest Transfer event...`);
        const transferEvents = await deChronicleContract.queryFilter("Transfer"); // Logs will be ordered by earliest, assumes no other transfers while running
        const transferInfo = transferEvents[transferEvents.length-1].args.to.toString();
        
        let userNFTs = transferEvents.filter(event => event.args.to.toString().toLowerCase() === currentAccount)
        userNFTs = userNFTs.map(event => event.args.tokenId.toString())

        const contributions = []

        for await (const nftId of userNFTs) {
            const metadataURI = await deChronicleContract.tokenURI(nftId)
            const response = await fetch(metadataURI)
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }

            const json = await response.json()
            contributions.push(json)
        }
            
        console.log(contributions);
        setUserContributions(contributions)
    }

    const checkIfPinataGroupIsCreated = async (groupname: string) => {
        try {
            const group = await pinata.groups.list().name(groupname)
            if (group[0]) {
                setUserContributionsId(group[0].id)
                console.log(group[0]);
                
                
            }
            else {
                console.log("Current user has not created a group yet");
            }
            
        } catch(e) {
            console.log(e);
            
        }
    }

    const createPinataGroup = async () => {
        const group = await pinata.groups.create({
            name: currentAccount
        })

        console.log("New group successfully created");
        console.log(group);
        setUserContributionsId(group.id)
    }

    const checkIfWalletIsConnected = async () => {
        try {
        if (!ethereum) return alert("Please install metamask");

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length) {
            setCurrentAccount(accounts[0]);
        } else {
            console.log("No accounts found");
        }

        checkIfPinataGroupIsCreated(accounts[0])
        
        console.log(accounts[0]);
        } catch(e) {
            console.log(e);
            throw new Error("No ethereum object.");
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install metamask");

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            setCurrentAccount(accounts[0]);
        } catch (e) {
            console.log(e);
            throw new Error("No ethereum object.");
        }
    }

    const getDeChronicleContract = async () => {
    
        const contractAddress = "0x30caf52f8E2bbAA54fd187CEA7ff4b8dD68E65E6"
        
        const provider = new ethers.BrowserProvider(ethereum)
        const signer = provider.getSigner()
        const deChronicleContract = new ethers.Contract(contractAddress, ABI.abi, (await signer))

        const signerAddr = (await signer).getAddress()
        signerAddr.then(res => {
            setContractOwner(res)
        })
        
    
        setDeChronicleContract(deChronicleContract)
        
        // console.log("Successfully fetched the contract" + deChronicleContract.getFunction("mintCollectionNFT"));
        
    }

    

    useEffect(() => {
        checkIfWalletIsConnected()
        getDeChronicleContract()
    }, []);

    return (
        <DeChronicleContext.Provider value={{ connectWallet, 
                                              currentAccount, 
                                              showFileUpload, 
                                              showTextEditor,
                                              handleShowFileUpload,
                                              handleShowTextEditor,
                                              fileType,
                                              deChronicleContract,
                                              contractOwner,
                                              userContributionsId,
                                              createPinataGroup,
                                              getUserContributions,
                                              userContributions,
                                              showProfile,
                                              setShowProfile }}>
            {children}
        </DeChronicleContext.Provider>
    )
}