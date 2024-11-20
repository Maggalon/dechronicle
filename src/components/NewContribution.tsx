import { useContext } from "react"
import { ImageIcon } from "../assets/ImageIcon"
import { SoundIcon } from "../assets/SoundIcon"
import { TextIcon } from "../assets/TextIcon"
import { VideoIcon } from "../assets/VideoIcon"
import Editor from "./Editor"
import { NFTOptionCard } from "./NFTOptionCard"
import UploadFile from "./UploadFile"
import { DeChronicleContext } from "../context/DeChronicleContext"

export const NewContribution = () => {

    const {showFileUpload, showTextEditor, handleShowFileUpload, handleShowTextEditor, fileType} = useContext(DeChronicleContext)

    return (
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h2 className="text-5xl text-center font-bold mb-2">Let's record mankind history together</h2>
        <p className="text-xl opacity-70 mb-6">Start your Contribution now!</p>
        {showTextEditor ? <Editor setShowTextEditor={handleShowTextEditor} /> : (showFileUpload ? <UploadFile setShowFileUpload={handleShowFileUpload} fileType={fileType} /> :
          <div className="w-full max-w-xl grid grid-cols-2 gap-5 mt-8">
            <NFTOptionCard icon={<ImageIcon />} handleFunction={() => handleShowFileUpload("image/*")} type="image" />
            <NFTOptionCard icon={<VideoIcon />} handleFunction={() => handleShowFileUpload("video/*")} type="video" />
            <NFTOptionCard icon={<TextIcon />} handleFunction={handleShowTextEditor} type="text" />
            <NFTOptionCard icon={<SoundIcon />} handleFunction={() => handleShowFileUpload("audio/*")} type="sound" />
          </div>
        )}
      </main>
    )
}