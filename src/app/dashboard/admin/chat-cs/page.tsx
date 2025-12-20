"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import {
  ref,
  onValue,
  push,
  update,
  remove,
  serverTimestamp,
} from "firebase/database";
import type { ChatClient, ChatMessage } from "@/lib/types";
import {
  Trash2,
  Send,
  User,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";

export default function CSChatPage() {
  const [clients, setClients] = useState<ChatClient[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");

  const [showToast, setShowToast] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatsRef = ref(db, "chats");
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedClients: ChatClient[] = [];

      if (data) {
        Object.keys(data).forEach((key) => {
          const meta = data[key].meta;
          if (meta) {
            loadedClients.push({
              id: key,
              name: meta.name || "Guest",
              lastMessage: meta.lastMessage,
              unreadCount: meta.unreadCount || 0,
              online: true,
            });
          }
        });
      }
      setClients(loadedClients.reverse());
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedClientId) return;

    const messagesRef = ref(db, `chats/${selectedClientId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const msgsData = snapshot.val();
      const loadedMessages: ChatMessage[] = [];

      if (msgsData) {
        Object.keys(msgsData).forEach((key) => {
          const m = msgsData[key];
          loadedMessages.push({
            id: key,
            senderId:
              m.sender === "user" ? (selectedClientId as string) : "admin",
            senderName: m.sender === "user" ? "Client" : "Admin",
            senderRole: (m.sender === "user" ? "USER" : "ADMIN") as any,
            receiverId:
              m.sender === "user" ? "admin" : (selectedClientId as string),
            message: m.text || "",
            timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
            isAdmin: m.sender === "agent",
            read: m.read || false,
          });
        });
      }
      setMessages(loadedMessages);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, [selectedClientId]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedClientId) return;

    const chatRef = ref(db, `chats/${selectedClientId}/messages`);
    push(chatRef, {
      sender: "agent",
      text: inputText,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: new Date().toISOString(),
    });

    update(ref(db, `chats/${selectedClientId}/meta`), {
      lastMessage: `Admin: ${inputText}`,
      lastTimestamp: serverTimestamp(),
    });

    setInputText("");
  };

  // Fungsi 1: Cuma buka modal konfirmasi
  const requestDeleteChat = () => {
    if (!selectedClientId) return;
    setIsDeleteModalOpen(true);
  };

  // Fungsi 2: Eksekusi hapus (dipanggil kalau user klik "Ya, Hapus" di modal)
  const confirmDeleteChat = () => {
    if (!selectedClientId) return;

    remove(ref(db, `chats/${selectedClientId}`))
      .then(() => {
        setIsDeleteModalOpen(false); // Tutup modal konfirmasi
        setShowToast(true); // Munculkan toast sukses
        setTimeout(() => setShowToast(false), 3000);

        setSelectedClientId(null);
        setMessages([]);
      })
      .catch((err) => {
        console.error(err);
        alert("Gagal menghapus");
        setIsDeleteModalOpen(false);
      });
  };

  return (
    <div className="relative w-full h-[600px] bg-white border border-gray-200 rounded-xl shadow-lg flex overflow-hidden font-sans">
      {/* --- MODAL KONFIRMASI HAPUS (POPUP TENGAH) --- */}
      {isDeleteModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-80 transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Hapus Sesi Chat?
              </h3>
              <p className="text-sm text-gray-500 mt-2 mb-6">
                Riwayat chat ini akan dihapus permanen dan tidak bisa
                dikembalikan.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDeleteChat}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors shadow-sm"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TOAST SUKSES (POPUP ATAS) --- */}
      {showToast && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium">
            <CheckCircle size={16} />
            <span>Sesi chat berhasil dihapus!</span>
          </div>
        </div>
      )}

      {/* --- SIDEBAR LIST CLIENT --- */}
      <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="font-bold text-gray-700 flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-600" />
            Antrian Chat
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {clients.length === 0 && (
            <div className="p-6 text-center text-gray-400 text-sm">
              Belum ada pesan masuk.
            </div>
          )}
          {clients.map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className={`p-4 border-b cursor-pointer transition-all hover:bg-white hover:shadow-sm
                                ${
                                  selectedClientId === client.id
                                    ? "bg-white border-l-4 border-l-blue-600 shadow-sm"
                                    : "border-l-4 border-l-transparent"
                                }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`font-semibold text-sm ${
                    selectedClientId === client.id
                      ? "text-blue-700"
                      : "text-gray-900"
                  }`}
                >
                  {client.name}
                </span>
                {client.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {client.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">
                {client.lastMessage}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 flex flex-col h-full bg-slate-100 min-w-0">
        {selectedClientId ? (
          <>
            {/* Header Chat */}
            <div className="h-16 border-b border-gray-200 bg-white px-6 flex justify-between items-center shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    {clients.find((c) => c.id === selectedClientId)?.name}
                  </h4>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={requestDeleteChat}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              >
                <Trash2 size={14} />
                Hapus Sesi
              </button>
            </div>

            {/* Messages List Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isAdmin ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm text-sm ${
                      msg.isAdmin
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.message}</p>
                    <p
                      className={`text-[10px] mt-1 text-right ${
                        msg.isAdmin ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ketik balasan..."
                  className="flex-1 border border-gray-300 bg-white text-gray-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-slate-50">
            <MessageSquare size={48} className="mb-4 text-gray-300" />
            <p>Pilih client di sebelah kiri untuk memulai chat.</p>
          </div>
        )}
      </div>
    </div>
  );
}
