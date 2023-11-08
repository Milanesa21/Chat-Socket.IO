import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io("/")

function App() {
  const [show, setShow] = useState(true)
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState("")

  const handleUsernameSubmit = (e) => {
    e.preventDefault()
    if (username.trim() !== "") {
      socket.emit('username', username)
      setShow(false)
    } else { 
      alert("Por favor, ingrese un nombre de usuario válido.")
    }
  }

  const handleMessageSubmit = (e) => {
    e.preventDefault()
    if (username.trim() !== "") {
      const newMessage = {
        body:message,
        from: username
      }
      setMessages([...messages, newMessage])
      socket.emit('message', newMessage)
      setMessage("")
    } else {
      alert("Por favor, ingrese un nombre de usuario válido antes de enviar un mensaje.")
    }
  }

  const handleTyping = () => {
    socket.emit('typing', username)
  }

  useEffect (() => {
    socket.on('messages', (messages) => {
      setMessages(messages)
    })

    socket.on('message', receiveMessage)

    socket.on('typing', (username) => {
      setTyping(username + " está escribiendo...")
      setTimeout(() => { setTyping("") }, 3000)
    })

    return () => {
      socket.off('messages')
      socket.off('message', receiveMessage)
      socket.off('typing')
    }
  }, [])

  const receiveMessage = message => 
  setMessages((state) => [...state, message])

  return (
    <div className ="h-screen bg-zinc-800 text-white flex items-center justify-center">
      
      {show  ? (
        <form onSubmit={handleUsernameSubmit} className="bg-zinc-900 p-10">
          <h1 className="text-2xl font-bold my-2"> Ingrese su nombre de usuario </h1>
          <input type="text" 
          placeholder="Escriba su nombre de usuario"
          className="border-2 border-zinc-500 p-2 w-full text-black"
          onChange={(e) => setUsername(e.target.value)}
          />
        </form>
      ) : (
        <form onSubmit={handleMessageSubmit} className="bg-zinc-900 p-10">
          <h1 className="text-2xl font-bold my-2"> Chat </h1>
          <input type="text" 
          placeholder="Escriba su mensaje"
          className="border-2 border-zinc-500 p-2 w-full text-black"
          onChange={(e) => { setMessage(e.target.value); handleTyping(); }}
          value={message}
          />

          <p>{typing}</p>

          <ul>
          {
            messages.map((message, i )=>(
              <li key = {i} className= {`my-2 p-2 table rounded-md ${message.from === username ? 'bg-purple-500'  : 'bg-zinc-700 ml-auto'}`}>
                <span className="text-xs block">{message.from}:</span>
            {message.body}
                </li>
            ))
          }
          </ul>

        </form>
      )}
     
    </div>
  )
}

export default App