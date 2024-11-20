

export const NFTOptionCard = ({ icon, handleFunction, type }) => {
    return (
        <div className="flex items-center justify-center w-full">
            <div onClick={handleFunction} className="flex flex-col items-center justify-center w-full h-full opacity-70 border-4 border-gray-50 rounded-lg cursor-pointer hover:opacity-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {icon}
                    <p className="mb-2 text-lg text-gray-50 dark:text-gray-400 font-bold">{`Create ${type} NFT`}</p>
                    <p className="text-sm text-gray-50 font-semibold dark:text-gray-400">Click to continue</p>
                </div>
            </div>
        </div>
    )
}