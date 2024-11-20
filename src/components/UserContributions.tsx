import { useContext } from "react"
import { FileIcon } from "../assets/FileIcon"
import { DeChronicleContext } from "../context/DeChronicleContext"


export const UserContributions = () => {


    const {userContributions} = useContext(DeChronicleContext)

    return (
        <main className="flex-grow flex flex-col items-center p-4">
            <h2 className="text-4xl text-center font-bold mb-20">Your Contributions</h2>
            {
                userContributions.map(contribution => {
                    return (
                        <div key={contribution.properties.asset.description} 
                             onClick={() => window.open(contribution.properties.asset.description, "_blank")}
                             className='w-full max-w-xl flex justify-start items-center border-2 border-gray-50 rounded-lg cursor-pointer p-4 mb-4 opacity-80 hover:opacity-100'>
                            <FileIcon />
                            <span className="text-xl">{contribution.properties.name.description}</span>
                        </div>
                    )
                })
            }
        </main>
    )
}