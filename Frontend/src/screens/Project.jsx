import axios from '../config/axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket';
import { UserContext } from '../context/user.context';
import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webContainer';


function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}

const Project = () => {

  const location = useLocation();
  const messageBox = React.createRef();


  // console.log(location.state?.project);

  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [project, setProject] = useState(location.state?.project);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const { user } = useContext(UserContext);
  
  const[fileTree, setFileTree] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [runProcess, setRunProcess] = useState(null);

  // console.log(location.state?.project._id);

  async function handleSendMessage () {

    sendMessage("project-message", {
      message,
      sender: user
    });

    setAllMessages(prevMessages => [...prevMessages, { sender: user, message }])
    setMessage("")
  };



  function writeAiMessage (message){

    const messageObjects = JSON.parse(message)

    return(
      <div className="overflow-auto bg-slate-900 text-white rounded-md p-2 scroll-auto">
        <Markdown
          children={messageObjects.text}
          options={{
          overrides:{ code: SyntaxHighlightedCode }
          }}
        />  
    </div>
    )
  }

  useEffect(() => {

    initializeSocket(project._id);

    if(!webContainer) {
      getWebContainer().then(container => {
        setWebContainer(container)
        console.log("webcontainer is started now");
      })
    }

    receiveMessage("project-message", data => {
      console.log(data);
      console.log(JSON.parse(data.message));

      const message = JSON.parse(data.message);

      webContainer?.mount(message.fileTree)

      if(message.fileTree){
        setFileTree(message.fileTree)
      }

      setAllMessages(prevMessages => [...prevMessages, data])
    })

    axios.get(`/projects/all-read-project-user/${location.state?.project._id}`)
      .then(res => {
        setProject(res.data.project);  
      })
      .catch(err => {
        console.error("Error", err);
      });
  }, []);

  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  }, [allMessages]);


  function appendInComingMessage (messageObject) {

    const messageBox = document.querySelector(".message-box");

    const message = document.createElement("div");
    message.classList.add('message', 'max-w-56', 'flex', 'flex-col', 'px-4', 'py-2', 'w-fit', 'bg-slate-50', 'rounded-md');
    if (messageObject.sender._id === "ai") {
      const markDown = (<Markdown>{messageObject.message}</Markdown>)
      message.innerHTML = `
      <small class='text-sm opacity-65'>${messageObject.sender.email}<small/>
      <p class='text-sm font-medium'>${markDown}</p>
      `
    } else {
      message.innerHTML = `
      <small class='text-sm opacity-65'>${messageObject.sender.email}<small/>
      <p class='text-sm font-medium'>${messageObject.message}</p>
      `
      messageBox.appendChild(message);
    }
    
    scrollToBottom();

  }

  function appendOutgoingngMessage (message) {

    const messageBox = document.querySelector(".message-box");

    const newMessage = document.createElement("div");
    newMessage.classList.add('ml-auto', 'message', 'max-w-56', 'flex', 'flex-col', 'px-4', 'py-2', 'w-fit', 'bg-slate-50', 'rounded-md');
    newMessage.innerHTML = `
      <small class='text-sm opacity-65'>${user.email}<small/>
      <p class='text-sm font-medium'>${message}</p>
    `
    messageBox.appendChild(newMessage);
    scrollToBottom();

  }



  function saveFileTree(ft) {
    axios.put("/projects/update-file-tree", {
      projectId: project._id,
      fileTree: ft
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }


  

  return (
    <main className='h-screen w-screen flex'>
      <section className='left h-full min-w-[25vw] bg-[#eae6df] flex flex-col'>
        <p className='text-gray-700 mt-1'>Other projects enter please,  <Link to="/home" className='text-blue-500 hover:underline'>click here...</Link></p>
        <header className='flex items-center justify-between p-3 px-4 w-full bg-[#c9c8c6]'>
          <Link to="/add-user" state={{ project: location.state?.project }}><button className='flex items-center cursor-pointer active:scale-95'><i className='ri-add-fill'></i> <p className='ml-1'>Add collaborator</p></button></Link>
          <h2 className='font-medium select-none'>{project.name}</h2>
          <button onClick={() => setSidePanelOpen(!sidePanelOpen)} className='cursor-pointer text-xl active:scale-110'><i className='ri-group-fill'></i></button>
        </header>
        <div className="conversation-area flex-grow flex flex-col overflow-hidden">
          <div ref={messageBox} className="message-box flex-grow p-2 flex flex-col gap-2 overflow-auto">
            {allMessages.map((msg, idx) => (
              <div key={idx} className={`${msg.sender._id === "ai" ? "max-w-80" : "max-w-52"} ${msg.sender._id == user._id.toString() && "ml-auto" } message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}>
                <small className='opacity-65 text-xs'>{msg.sender.email}</small>
                <p className='text-sm'>
                  {msg.sender._id === "ai" ?
                    writeAiMessage(msg.message)
                    : msg.message
                  }
                </p>
              </div>
            ))}
          </div>

          <div className="input-field bg-[#f0f0f0] px-4 py-2 ml-2 flex items-center">
            <input 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            type="text" placeholder='Type a message...' onKeyDown={(e) => {
              if(e.key === "Enter"){
                handleSendMessage()
              }
            }}  className='border-none outline-none flex-grow mr-2 px-2 py-1 rounded-md'/>
            <button onClick={() => {handleSendMessage()}} className='px-4 py-2 bg-[#008069] text-white cursor-pointer rounded-md active:scale-95 hover:bg-[#006f5e]'><i className="ri-send-plane-2-fill"></i></button>
          </div>
        </div>

        <div className={`side-panel w-[25vw] h-full flex flex-col gap-2 bg-slate-200 absolute top-0 transition-all ${ sidePanelOpen ? 'transition-x-0': '-translate-x-full'}`}>
          <header className='flex items-center justify-between p-3 px-4 w-full bg-slate-50'>
            <h1 className='font-semibold select-none'>All Collaborators :-</h1>
            <button onClick={() => setSidePanelOpen(!sidePanelOpen)} className='cursor-pointer text-xl active:scale-110'><i className="ri-close-fill"></i></button>
          </header>
          <div className="user-show-container flex flex-col gap-2 px-4">
            {project.users && project.users.map((user, idx) => {
              return <div key={idx} className="flex items-center gap-2 bg-slate-400 px-4 py-2 rounded-md cursor-pointer hover:bg-slate-500 transition-all active:scale-95">
                <div className="w-fit h-fit flex items-center justify-center text-white p-4 aspect-square rounded-full bg-gray-600 cursor-pointer text-xl"><i className='ri-user-fill absolute'></i></div>
                <h1 className='font-semibold'>{user.email}</h1>
              </div>
            })}
          </div>
        </div>
      </section>

      <section className='right h-full flex-grow flex bg-[#2E3440]'>
        <div className="explorer h-full max-w-64 min-w-52 bg-[#363c47] text-[#d4d4d4] py-1 overflow-auto">
          <div className="file-tree flex flex-col gap-2">
            {
              Object.keys(fileTree).map((file, idx) => (
                <button key={idx} onClick={()=> {
                  setCurrentFile(file)
                  setOpenFiles([...new Set([...openFiles, file])])
                  }} className="tree-element bg-[#0d0c0c] hover:bg-[#1d1c1c] cursor-pointer p-2 active:scale-95 transition-all">
                  <p className="font-semibold text-sm">{file}</p>
                </button>
              ))
            }
          </div>
        </div>

        <div className="code-editor h-full max-w-[61.4vw] overflow-hidden flex flex-col flex-grow bg-[#3d424b] py-1 text-[#d4d4d4] ">
          <div className="top w-full flex items-center justify-between gap-1 bg-[#363c47] overflow-x-auto">
            <div className="files flex">
            {
              openFiles.map((file, idx) => (
                <div key={idx} className="top-header flex items-center gap-5 w-fit bg-[#0d0c0c] hover:bg-[#1d1c1c] px-4 py-2 transition-all">
                  <button onClick={() => setCurrentFile(file)}>
                    <p className='font-semibold text-sm cursor-pointer active:scale-95'>{file}</p>
                  </button>
                  <button onClick={() => {
                    setOpenFiles(prev => {
                      const updatedFiles = prev.filter(f => f !== file);
                      if(currentFile === file) {
                        setCurrentFile(updatedFiles[0] || null)
                      }
                      return updatedFiles;
                    })
                  }}
                  className='cursor-pointer active:scale-95'><i className="ri-close-line"></i>
                  </button>
                </div>
              ))
            }
            </div>
            <div className="actions flex gap-2">
              <button onClick={async () => {
                await webContainer.mount(fileTree)

                const installProcess = await webContainer.spawn("npm", ["install"])
                installProcess.output.pipeTo(new WritableStream({
                  write(chunk){
                    console.log(chunk)
                  }
                }))

                if(runProcess) {
                  runProcess.kill()
                }

                let tempRunProcess = await webContainer.spawn("npm", ["start"])
                tempRunProcess.output.pipeTo(new WritableStream({
                  write(chunk){
                    console.log(chunk)
                  }
                }))
                setRunProcess(tempRunProcess);

                webContainer.on("server-ready", (port, url) => {
                  console.log(port, url);
                  setIframeUrl(url)
                })
                  
              }} className='px-4 p-2 bg-slate-500 text-white cursor-pointer rounded-md active:scale-95 hover:bg-slate-700'>Run</button>
            </div>
          </div>
            
          <div className="bottom flex flex-grow w-full h-full shrink overflow-auto">
            {fileTree[currentFile] && (
              <div className="h-full overflow-auto flex-grow">
                <pre className='hljs h-full'>
                  <code className='code-editor-area hljs h-full outline-none' contentEditable suppressContentEditableWarning onBlur={(e) => {
                    const updatedContent = e.target.innerText;
                    setFileTree(pre => ({ ...pre, [currentFile]: {
                      ...pre[currentFile],
                      file: {
                        ...pre[currentFile].file,
                        contents: updatedContent
                      }
                    } }))
                    }}
                    dangerouslySetInnerHTML={{__html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value}} 
                    style={{
                      whiteSpace: 'pre-wrap',
                      paddingBottom: '25rem',
                      counterSet: 'line-numbering',
                    }}
                  />
                </pre>
              </div>
            )}
          </div>
        </div>

        {iframeUrl && webContainer && (
          <div className="flex flex-col h-full">
            <div className="address-bar">
              <input type="text" onChange={(e) => {
                setIframeUrl(e.target.value)
              }} value={iframeUrl} className='w-full px-4 p-2 bg-slate-200 outline-none' />
            </div>
            <iframe src={iframeUrl} className='w-full h-full bg-[#82868f]'></iframe>
          </div>
        )}  

      </section>
    </main>
  )
}

export default Project;
