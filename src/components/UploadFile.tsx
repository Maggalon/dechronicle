import { ethers } from 'ethers'

import { pinata } from '../utils/config'

import { useState, useRef, useEffect, useContext } from 'react'
import { DeChronicleContext } from '../context/DeChronicleContext'

const UploadFile = ({ fileType, setShowFileUpload }) => {

    const [file, setFile] = useState<File>()
    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [isDisabled, setIsDisabled] = useState<boolean>(false)

    const { contractOwner, deChronicleContract, userContributionsId, createPinataGroup } = useContext(DeChronicleContext)

    const inputRef = useRef(null)


    const fileUploadHandler = (file: File | undefined) => {
        console.log(file);
        console.log(inputRef.current);

        if (file == undefined) {
            inputRef.current.value = "";
            inputRef.current.type = "text";
            inputRef.current.type = "file";
        }
        
        
        setFile(file)
        setTimeout(() => {
            setIsDisabled(!isDisabled)
        })
        
    }

    const handleSubmitNFT = async () => {
        if (!file) {
            console.log("No file provided");
            return;
        }
        try {
            // Metadata group id "dd3ebab4-88a0-4f57-a64a-3b6b7c57e79a"
            
            
            if (userContributionsId == "") {
                await createPinataGroup()
            }

            let metadata = {
                "title": "Asset Metadata",
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": name
                    },
                    "description": {
                        "type": "string",
                        "description": description
                    },
                    "asset": {
                        "type": "string",
                        "description": ""
                    }
                }
            }

            // let nftObject = {
            //     id: 0,
            //     metadata: metadata
            // }

            const upload = await pinata.upload.file(file)
            
            metadata.properties.asset.description = await pinata.gateways.convert(upload.IpfsHash)

            console.log(metadata);

            // nftObject.metadata.properties.image.description += upload.IpfsHash;
            // const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash)

            //console.log(JSON.stringify(metadata));



            const uploadMetadata = await pinata.upload.json(metadata)
            console.log(userContributionsId);
            
            const pinataMetadata = await pinata.groups.addCids({
                groupId: userContributionsId,
                cids: [uploadMetadata.IpfsHash]
            })

            console.log("Metadata upload status: " + pinataMetadata);
            
            inputRef.current.value = "";
            inputRef.current.type = "text";
            inputRef.current.type = "file";
            setFile(undefined)
            setName("")
            setDescription("")
            setTimeout(() => {
                setIsDisabled(!isDisabled)
            })

            const metadataUrl = await pinata.gateways.convert(uploadMetadata.IpfsHash)
            console.log(contractOwner);
            

            const deployedTokenId = await deChronicleContract.mintCollectionNFT(contractOwner, metadataUrl)
            
            
            await deployedTokenId.wait()
            console.log(`NFT with CID ${upload.IpfsHash} minted to ${contractOwner}`);

            
            
            
            
        } catch(e) {
            console.log(e);
        }
    }


    let formats;
    if (fileType == "image/*") {
        formats = "SVG, PNG, JPG or GIF"
    } else if (fileType == "video/*") {
        formats = "MP4, MOV or AVI"
    } else if (fileType == "audio/*") {
        formats = "MP3, WAV, FLAC or M4A"
    }

    return (
        <div className="flex items-center justify-center w-full flex-col w-full max-w-2xl">
            <label htmlFor="dropzone-file" className={`w-full max-w-2xl flex flex-col items-center justify-center h-64 border-4 border-gray-100 border-dashed rounded-lg dark:hover:bg-gray-800 dark:bg-gray-700 ${!isDisabled && "hover:bg-gray-100/40 cursor-pointer"} dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}>
                <div className="flex flex-col items-center justify-center">
                    {file ?
                        <div className='flex justify-center items-center'>
                            <svg
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                className="w-8 h-8 text-gray-50 mr-4"
                            >
                                <path d="M14 4.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2h5.5L14 4.5zm-3 0A1.5 1.5 0 019.5 3V1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4.5h-2z" />
                            </svg>
                            {file.name}
                            <button type="button" 
                                    onClick={() => {
                                        fileUploadHandler(undefined)
                                    }}
                                    className="text-gray-50 bg-transparent ml-4">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Delete file</span>
                            </button>
                        </div>
                    :
                    <>
                    <svg className="w-8 h-8 mb-4 text-gray-100 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-100 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-100 dark:text-gray-400">{formats}</p>
                    </>
                    }
                </div>
                <input id="dropzone-file" 
                       type="file" 
                       className="hidden" 
                       onChange={(e) => {
                        fileUploadHandler(e.target?.files?.[0])
                       }} 
                       accept={fileType} 
                       disabled={isDisabled}
                       ref={inputRef} />
            </label>
            <div className="mt-6 w-full">
                <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-50 dark:text-white">Name</label>
                <input required
                       type="text" 
                       id="large-input" 
                       value={name}
                       onChange={(e) => {setName(e.target.value)}}
                       className="block w-full p-3 text-gray-900 opacity-80 border border-gray-300 rounded-lg bg-gray-50 text-lg focus:ring-gray-300 focus:border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <div className="mt-4 w-full">
                <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-50 dark:text-white">Description</label>
                <input required
                       type="text" 
                       id="large-input" 
                       value={description}
                       onChange={(e) => {setDescription(e.target.value)}}
                       className="block w-full p-3 text-gray-900 opacity-80 border border-gray-300 rounded-lg bg-gray-50 text-lg focus:ring-gray-300 focus:border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <div className="w-full mt-4 flex items-center justify-between">
                <button type="button" onClick={() => setShowFileUpload(false)} className="text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500">
                    <svg
                    baseProfile="tiny"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-gray-500 mr-2"
                    >
                    <path d="M19.164 19.547c-1.641-2.5-3.669-3.285-6.164-3.484V17.5c0 .534-.208 1.036-.586 1.414-.756.756-2.077.751-2.823.005l-6.293-6.207a1 1 0 010-1.425l6.288-6.203c.754-.755 2.073-.756 2.829.001.377.378.585.88.585 1.414v1.704c4.619.933 8 4.997 8 9.796v1a.999.999 0 01-1.836.548zm-7.141-5.536c2.207.056 4.638.394 6.758 2.121a7.985 7.985 0 00-6.893-6.08C11.384 9.996 11 10 11 10V6.503l-5.576 5.496 5.576 5.5V14l1.023.011z" />
                    </svg>
                    Go back
                </button>
                <button type="button" 
                        onClick={handleSubmitNFT}
                        className="text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500">
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-gray-900 mr-2"
                        >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M9 12h6M12 9v6M4 6V5a1 1 0 011-1h1m5 0h2m5 0h1a1 1 0 011 1v1m0 5v2m0 5v1a1 1 0 01-1 1h-1m-5 0h-2m-5 0H5a1 1 0 01-1-1v-1m0-5v-2m0-5" />
                    </svg>
                    Create NFT
                </button>
            </div>
        </div> 
    )
}

export default UploadFile;