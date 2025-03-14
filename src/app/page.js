'use client'
import { useEffect, useState } from "react";

export default function Home() {

  const [chat, setChat] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    const initChat = async () => {    
      try {
        const response = await fetch("http://localhost:3000/init")
        
        const data = await response.json()
        setChat([{ message: data.message, sender: 'bot' }])
      } catch (error) {
        console.log(error)
      }
    }
    initChat()
  }, [])

  const handleSubmit = async () => {
    try {
      setChat([...chat, { message, sender: 'user' }])

      const response = await fetch("http://localhost:3000/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: message })
      })
      
      const data = await response.json()
      setChat(prevChat => [...prevChat, { message: data.response, sender: 'bot' }])
      setMessage("")


    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      {chat.map((item, index) => (
        <div key={index}  style={{ 
          ...styles.messageContainer, 
          ...(item.sender === 'bot' ? styles.botMessage : styles.userMessage) 
        }}>
          <p className="text-lg">{item.message}</p>
        </div>
      ))}

      <div className="absolute bottom-6 mx-auto">
        <textarea
          value={ message }
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none h-25 p-4 text-lg  bg-zinc-700 border border-gray-500 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"></textarea>
          <button onClick={handleSubmit} className="w-1/2 cursor-pointer px-2 py-2 text-lg text-white bg-blue-950 border border-zinc-900 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500">Ask to AI</button>
      </div>
    </div>
  );
}

const styles = {
  botMessage: {
    backgroundColor: '#4B5563', // bg-zinc-700
    alignSelf: 'flex-start'
  },
  userMessage: {
    backgroundColor: '#D1D5DB', // bg-gray-300
    alignSelf: 'flex-end'
  },
  messageContainer: {
    width: '33%',
    padding: '0.5rem',
    border: '1px solid #6B7280', // border-gray-500
    borderRadius: '0.5rem'
  }
}
