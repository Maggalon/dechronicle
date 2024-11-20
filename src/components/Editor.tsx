import { AdmonitionDirectiveDescriptor, BlockTypeSelect, BoldItalicUnderlineToggles, codeBlockPlugin, codeMirrorPlugin, CodeToggle, CreateLink, directivesPlugin, headingsPlugin, imagePlugin, InsertCodeBlock, InsertImage, InsertTable, linkDialogPlugin, linkPlugin, listsPlugin, ListsToggle, markdownShortcutPlugin, MDXEditor, MDXEditorMethods, quotePlugin, tablePlugin, toolbarPlugin, UndoRedo } from "@mdxeditor/editor"
import '@mdxeditor/editor/style.css'
import { pinata } from "../utils/config"
import { useRef } from "react"
import { Ethereum } from "../assets/Ethereum"

const Editor = ({ setShowTextEditor }) => {

  const ref = useRef<MDXEditorMethods>(null)

  const handleSendToBlockchain = () => {
    //console.log(value);
    console.log(ref.current?.getMarkdown())
  };


  const imageUploadHandler = async (image: File) => {
    try {
      const upload = await pinata.upload.file(image)
      console.log(upload);

      const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash)
      return ipfsUrl
    } catch (e) {
      console.log(e);
    }
  }

  const defaultMarkdown = `

  # Welcome

  As a **brave writer** you can write here any information you want to share. Once sent to blockchain, the data will be stored there forever.&#x20;

  As a **curious reader** you can discover Contributions of other people. If you like their work and want to support it, you can share some CHRN with them


  `

  return (
    <div className="w-full max-w-2xl mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <div className="bg-white rounded-t-lg dark:bg-gray-800 text-black">
        <MDXEditor ref={ref} 
                      markdown={defaultMarkdown} 
                      contentEditableClassName="prose"
                      plugins={[
                      directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
                      headingsPlugin(),
                      quotePlugin(),
                      listsPlugin(),
                      linkDialogPlugin(),
                      tablePlugin(),
                      linkPlugin(),
                      imagePlugin({ imageUploadHandler }),
                      codeBlockPlugin({defaultCodeBlockLanguage: 'js'}),
                      codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', html: 'HTML' } }),
                      markdownShortcutPlugin(),
                      toolbarPlugin({
                        toolbarContents: () => (
                          <>
                            {' '}
                            <UndoRedo />
                            <BlockTypeSelect />
                            <BoldItalicUnderlineToggles />
                            <CodeToggle />
                            <CreateLink />
                            <ListsToggle />
                            <InsertTable />
                            <InsertImage />
                            <InsertCodeBlock />
                            {/* <ChangeAdmonitionType /> */}
                          </>
                        )
                      })
                    ]}
                      />
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
          <button type="button" onClick={setShowTextEditor} className="text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500">
            <svg
              baseProfile="tiny"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-gray-500 mr-2"
            >
              <path d="M19.164 19.547c-1.641-2.5-3.669-3.285-6.164-3.484V17.5c0 .534-.208 1.036-.586 1.414-.756.756-2.077.751-2.823.005l-6.293-6.207a1 1 0 010-1.425l6.288-6.203c.754-.755 2.073-.756 2.829.001.377.378.585.88.585 1.414v1.704c4.619.933 8 4.997 8 9.796v1a.999.999 0 01-1.836.548zm-7.141-5.536c2.207.056 4.638.394 6.758 2.121a7.985 7.985 0 00-6.893-6.08C11.384 9.996 11 10 11 10V6.503l-5.576 5.496 5.576 5.5V14l1.023.011z" />
            </svg>
            Go back
          </button>
          
          <button type="button" onClick={handleSendToBlockchain} className="text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500">
            <Ethereum />
            Send to Blockchain
          </button>
        </div>
    </div>
      
  )
}

export default Editor;