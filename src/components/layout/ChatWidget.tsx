
"use client"; 

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import {
  ref,
  push,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  update,
  serverTimestamp,
  increment,
} from "firebase/database";


interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  timestamp: string | number;
  isEdited?: boolean;
  isDeleted?: boolean;
  isEditingLocal?: boolean; 
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedSession = localStorage.getItem("chatSessionId");
      if (!storedSession) {
        storedSession = "user_" + Date.now();
        localStorage.setItem("chatSessionId", storedSession);
      }
      setSessionId(storedSession);
    }
  }, []);

  
  useEffect(() => {
    if (!sessionId) return;

    const messagesRef = ref(db, `chats/${sessionId}/messages`);
    const sessionRef = ref(db, `chats/${sessionId}`);

    
    const unsubAdd = onChildAdded(messagesRef, (snapshot) => {
      const msg = snapshot.val();
      setMessages((prev) => [...prev, { ...msg, id: snapshot.key }]);
    });

    
    const unsubChange = onChildChanged(messagesRef, (snapshot) => {
      const updatedMsg = snapshot.val();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === snapshot.key
            ? { ...updatedMsg, id: snapshot.key, isEditingLocal: false }
            : m
        )
      );
    });

    
    const unsubRemove = onChildRemoved(sessionRef, () => {
      setMessages([]);
      alert("Sesi chat telah diakhiri oleh Admin.");
    });

    return () => {
      
      unsubAdd();
      unsubChange();
      unsubRemove();
    };
  }, [sessionId]);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  
  const sendMessage = () => {
    if (!inputVal.trim()) return;

    const now = new Date();
    
    
    update(ref(db, `chats/${sessionId}/meta`), {
      name: "Guest User",
      lastMessage: inputVal.trim(),
      lastTimestamp: serverTimestamp(),
      unreadCount: increment(1),
    });

   
    push(ref(db, `chats/${sessionId}/messages`), {
      sender: "user",
      text: inputVal.trim(),
      time: now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: now.toISOString(),
      isEdited: false,
    });

    setInputVal("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

 
  const isWithin5Minutes = (timestamp: string | number) => {
    if (!timestamp) return false;
    const diff = (new Date().getTime() - new Date(timestamp).getTime()) / (1000 * 60);
    return diff <= 5;
  };


  const deleteMessage = (id: string, timestamp: string | number) => {
    if (!isWithin5Minutes(timestamp)) {
      alert("Pesan hanya dapat dihapus dalam 5 menit!");
      return;
    }
    update(ref(db, `chats/${sessionId}/messages/${id}`), {
      text: "🗑️ Pesan dihapus oleh pengguna",
      isDeleted: true,
    });
  };

  const toggleEditLocal = (id: string, timestamp: string | number) => {
    if (!isWithin5Minutes(timestamp)) {
      alert("Pesan hanya dapat diedit dalam 5 menit!");
      return;
    }
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isEditingLocal: !m.isEditingLocal } : { ...m, isEditingLocal: false }
      )
    );
  };

  const saveEdit = (id: string, newText: string) => {
    if (newText && newText.trim()) {
      update(ref(db, `chats/${sessionId}/messages/${id}`), {
        text: newText.trim(),
        isEdited: true,
      });
     
    }
   
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isEditingLocal: false } : m))
    );
  };

 
  return (
    <div className="fixed bottom-5 right-5 z-[9999] font-sans">
   
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-[60px] h-[60px] rounded-full bg-[#8cc55a] text-white border-none cursor-pointer text-2xl shadow-lg transition-transform hover:scale-110 hover:bg-[#7ab84a] flex items-center justify-center`}
      >
        {isOpen ? "✖" : "💬"}
      </button>

 
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[320px] h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
          <div className="bg-[#8cc55a] text-white p-3 flex items-center">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center mr-3">
              💬
            </div>
            <div>
              <div className="font-bold">Customer Service</div>
              <div className="text-xs text-white/80">Online</div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto bg-transparent border-none text-white text-lg cursor-pointer"
            >
              ✖
            </button>
          </div>

         
          <div className="bg-[#f7f7f7] p-3 flex-grow overflow-y-auto flex flex-col gap-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[75%] ${
                  msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                }`}
              >
               
                {msg.isEditingLocal ? (
                  <div className="bg-[#8cc55a] p-2 rounded-lg flex gap-2 items-center">
                    <input
                      type="text"
                      defaultValue={msg.text}
                      className="flex-grow bg-white/20 border border-white/50 rounded px-2 py-1 text-white text-sm outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(msg.id, e.currentTarget.value);
                        if (e.key === "Escape") toggleEditLocal(msg.id, msg.timestamp);
                      }}
                    />
                    <button onClick={(e) => saveEdit(msg.id, (e.currentTarget.previousSibling as HTMLInputElement).value)} className="text-xs bg-white text-black px-2 py-1 rounded">✓</button>
                    <button onClick={() => toggleEditLocal(msg.id, msg.timestamp)} className="text-xs bg-white text-black px-2 py-1 rounded">✕</button>
                  </div>
                ) : (
                
                  <>
                    <div
                      className={`px-3 py-2 rounded-lg text-sm ${
                        msg.isDeleted
                          ? "italic text-gray-500 bg-gray-200"
                          : msg.sender === "user"
                          ? "bg-[#8cc55a] text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.text} {msg.isEdited && <span className="text-[10px] opacity-70">(edited)</span>}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">
                      {msg.time}
                    </div>
                    
                   
                    {msg.sender === "user" && !msg.isDeleted && isWithin5Minutes(msg.timestamp) && (
                      <div className="flex gap-2 mt-1">
                        <button onClick={() => toggleEditLocal(msg.id, msg.timestamp)} className="text-[10px] text-gray-400 hover:text-gray-600">✎ Edit</button>
                        <button onClick={() => deleteMessage(msg.id, msg.timestamp)} className="text-[10px] text-gray-400 hover:text-red-500">❌ Hapus</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

         
          <div className="flex p-3 border-t bg-white">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ketik pesan..."
              className="flex-grow p-2 border border-gray-300 rounded-lg outline-none focus:border-[#8cc55a]"
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-[#8cc55a] text-white border-none px-3 py-2 rounded-lg cursor-pointer hover:bg-[#7ab84a]"
            >
              ↪
            </button>
          </div>
        </div>
      )}
    </div>
  );
}