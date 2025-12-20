"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Cek Session ID
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

  // 2. Listener Firebase (DIPERBAIKI)
  useEffect(() => {
    if (!sessionId) return;

    const messagesRef = ref(db, `chats/${sessionId}/messages`);
    const sessionRef = ref(db, `chats/${sessionId}`);

    // FIX: Cek duplikat ID agar pesan tidak muncul ganda (loop visual)
    const unsubAdd = onChildAdded(messagesRef, (snapshot) => {
      const msg = snapshot.val();
      setMessages((prev) => {
        // Jika ID sudah ada di state, jangan tambah lagi
        if (prev.some((m) => m.id === snapshot.key)) {
          return prev;
        }
        return [...prev, { ...msg, id: snapshot.key }];
      });
    });

    // Handle Edit/Perubahan Status
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

    // Handle Hapus Sesi
    const unsubRemove = onChildRemoved(sessionRef, () => {
      setMessages([]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });

    return () => {
      unsubAdd();
      unsubChange();
      unsubRemove();
    };
  }, [sessionId]);

  // 3. Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = () => {
    if (!inputVal.trim()) return;
    const now = new Date();

    // Update Meta Data
    update(ref(db, `chats/${sessionId}/meta`), {
      name: "Guest User",
      lastMessage: inputVal.trim(),
      lastTimestamp: serverTimestamp(),
      unreadCount: increment(1),
    });

    // Push Pesan Baru
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
    const diff =
      (new Date().getTime() - new Date(timestamp).getTime()) / (1000 * 60);
    return diff <= 5;
  };

  const deleteMessage = (id: string, timestamp: string | number) => {
    if (!isWithin5Minutes(timestamp)) {
      alert("Pesan hanya dapat dihapus dalam 5 menit!");
      return;
    }
    // Update pesan menjadi terhapus
    update(ref(db, `chats/${sessionId}/messages/${id}`), {
      text: "🗑️ Pesan dihapus oleh pengguna",
      isDeleted: true,
      // Tips: Tambahkan flag ini jika Bot kamu bisa membacanya untuk ignore
      // ignoreBot: true
    });
  };

  const toggleEditLocal = (id: string, timestamp: string | number) => {
    if (!isWithin5Minutes(timestamp)) {
      alert("Pesan hanya dapat diedit dalam 5 menit!");
      return;
    }
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, isEditingLocal: !m.isEditingLocal }
          : { ...m, isEditingLocal: false }
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

  if (pathname?.startsWith("/dashboard/admin")) {
    return null;
  }

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
          {/* Header */}
          <div className="bg-[#8cc55a] text-white p-3 flex items-center shrink-0">
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

          {/* Popup Toast */}
          {showToast && (
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 text-white px-4 py-2 rounded text-xs shadow-lg w-[90%] text-center">
              ⚠️ Sesi chat telah dihapus Admin.
            </div>
          )}

          {/* Area Pesan */}
          <div className="bg-[#f7f7f7] p-3 flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 relative">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-10 text-sm px-4">
                <p className="font-bold mb-1">Selamat datang di Cema Design!</p>
                <p>Silahkan berikan pertanyaan, kami siap membantu Anda.</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === "user"
                    ? "self-end items-end"
                    : "self-start items-start"
                }`}
              >
                {/* --- MODE EDIT --- */}
                {msg.isEditingLocal ? (
                  <div className="bg-white border border-gray-300 p-2 rounded-lg flex flex-col gap-2 w-full min-w-[200px] shadow-sm">
                    <textarea
                      defaultValue={msg.text}
                      rows={2}
                      className="w-full resize-none bg-gray-50 border border-gray-200 rounded p-2 text-black text-sm outline-none focus:ring-1 focus:ring-[#8cc55a]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          saveEdit(msg.id, e.currentTarget.value);
                        }
                        if (e.key === "Escape")
                          toggleEditLocal(msg.id, msg.timestamp);
                      }}
                      autoFocus
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleEditLocal(msg.id, msg.timestamp)}
                        className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-200 font-medium flex items-center gap-1 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={(e) => {
                          const textarea = e.currentTarget.parentElement
                            ?.previousElementSibling as HTMLTextAreaElement;
                          if (textarea) saveEdit(msg.id, textarea.value);
                        }}
                        className="text-xs bg-[#8cc55a] text-white px-3 py-1.5 rounded-md hover:bg-[#7bc04a] font-medium flex items-center gap-1 transition-colors"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  /* --- TAMPILAN PESAN --- */
                  <>
                    <div
                      className={`px-3 py-2 rounded-lg text-sm break-words ${
                        msg.isDeleted
                          ? "italic text-gray-500 bg-gray-200"
                          : msg.sender === "user"
                          ? "bg-[#8cc55a] text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.text}{" "}
                      {msg.isEdited && (
                        <span className="text-[10px] opacity-70 block text-right mt-1">
                          (edited)
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">
                      {msg.time}
                    </div>

                    {msg.sender === "user" &&
                      !msg.isDeleted &&
                      isWithin5Minutes(msg.timestamp) && (
                        <div className="flex gap-3 mt-1 opacity-60 hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              toggleEditLocal(msg.id, msg.timestamp)
                            }
                            className="text-[10px] text-gray-500 hover:text-[#8cc55a] font-medium cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMessage(msg.id, msg.timestamp)}
                            className="text-[10px] text-gray-500 hover:text-red-500 font-medium cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Area Input */}
          <div className="flex p-3 border-t bg-white shrink-0">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ketik pesan..."
              className="flex-grow p-2 border border-gray-300 rounded-lg outline-none focus:border-[#8cc55a] bg-white text-black placeholder-gray-400"
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
