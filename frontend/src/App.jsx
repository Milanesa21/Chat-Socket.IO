import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io("/")

function App() {

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newMessage = {
      body:message,
      from: 'Yo'
    }
    setMessages([...messages, newMessage])
    socket.emit('message', message)
  };

  useEffect (() => {
    socket.on('message', receiveMessage);

    return () => {
      socket.off('message', receiveMessage);

    }
  }, []);

  const receiveMessage = message => 
  setMessages((state) => [...state, message]);

  return (
    <div className ="h-screen bg-zinc-800 text-white flex items-center justify-center">
      
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2"> Chat </h1>
        <input type="text" 
        placeholder="Escriba su mensaje"
        className="border-2 border-zinc-500 p-2 w-full text-black"
        onChange={(e) => setMessage(e.target.value)}
        />

        <ul>
       {
        messages.map((message, i )=>(
          <li key = {i} className= {`my-2 p-2 table rounded-md ${message.from === 'Yo' ? 'bg-purple-500'  : 'bg-zinc-700 ml-auto'}`}>
            <span className="text-xs block">{message.from}:</span>
        {message.body}
            </li>
        ))
       }
      </ul>

      </form>
     
    </div>
  )
}

export default App