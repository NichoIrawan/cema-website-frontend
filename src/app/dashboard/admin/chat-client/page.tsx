"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, DataSnapshot, push, update, serverTimestamp, off, remove } from "firebase/database";
import { Send, Search, User, Trash2, AlertTriangle, CheckCircle } from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  sender: "client" | "admin";
  timestamp: number;
}

interface UserChatMetadata {
  userName: string;
  userEmail?: string;
  lastMessage: string;
  timestamp: number;
  unreadCount?: number;
}

interface UserChatListItem {
  uid: string;
  meta: UserChatMetadata;
}

export default function AdminChatPage() {
  const [users, setUsers] = useState<UserChatListItem[]>([]);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  // UI States for Delete Feature
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Listen ke list user di Firebase (Node "chata")
  useEffect(() => {
    const chataRef = ref(db, "chata");
    const listener = onValue(chataRef, (snapshot: DataSnapshot) => {
      if (!snapshot.exists()) {
        setUsers([]);
        return;
      }

      const data = snapshot.val();
      const loadedUsers: UserChatListItem[] = [];

      Object.keys(data).forEach((uid) => {
        const meta = data[uid].meta;
        if (meta) {
          loadedUsers.push({
            uid: uid,
            meta: {
              userName: meta.userName || "Unknown User",
              userEmail: meta.userEmail || "",
              lastMessage: meta.lastMessage || "",
              timestamp: meta.timestamp || 0,
              unreadCount: meta.unreadCount || 0,
            },
          });
        }
      });

      // Urutkan: Chat terbaru muncul paling atas
      const sorted = loadedUsers.sort(
        (a, b) => (b.meta.timestamp || 0) - (a.meta.timestamp || 0)
      );
      setUsers(sorted);
    });

    return () => {
      off(chataRef, "value", listener);
    };
  }, []);

  // 2. Listen ke isi pesan saat user dipilih
  useEffect(() => {
    if (!selectedUid) return;

    const messagesRef = ref(db, `chata/${selectedUid}/messages`);
    const listener = onValue(messagesRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgArray = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value
        })) as ChatMessage[];

        setMessages(
          msgArray.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
        );
      } else {
        setMessages([]);
      }
    });

    // Reset unread count ketika membuka chat
    const metaRef = ref(db, `chata/${selectedUid}/meta`);
    update(metaRef, { unreadCount: 0 }).catch(err => console.error("Failed to reset unread", err));

    return () => {
      off(messagesRef, "value", listener);
    };
  }, [selectedUid]);

  // Auto scroll ke bawah saat pesan baru masuk
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!selectedUid || !replyText.trim()) return;
    setLoading(true);

    try {
      const text = replyText.trim();
      setReplyText(""); // Optimistic update

      // 1. Push message to firebase
      const messagesRef = ref(db, `chata/${selectedUid}/messages`);
      await push(messagesRef, {
        text: text,
        sender: "admin",
        timestamp: serverTimestamp()
      });

      // 2. Update meta data
      const metaRef = ref(db, `chata/${selectedUid}/meta`);
      await update(metaRef, {
        lastMessage: `You: ${text}`,
        timestamp: serverTimestamp(),
      });

    } catch (error) {
      console.error("Failed to send message", error);
      alert("Gagal mengirim pesan");
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE FEATURE LOGIC ---
  const requestDeleteChat = () => {
    if (!selectedUid) return;
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteChat = async () => {
    if (!selectedUid) return;

    try {
      await remove(ref(db, `chata/${selectedUid}`));

      setIsDeleteModalOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      setSelectedUid(null);
      setMessages([]);
    } catch (error) {
      console.error("Gagal menghapus chat:", error);
      alert("Gagal menghapus chat");
      setIsDeleteModalOpen(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.meta.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.meta.userEmail && user.meta.userEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeUser = users.find((u) => u.uid === selectedUid);

  return (
    <div className="relative flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden font-sans">

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
                Riwayat chat ini akan dihapus permanen dan tidak bisa dikembalikan.
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

      {/* Sidebar - Daftar User dari Firebase */}
      <div className="w-80 bg-white border-r flex flex-col shadow-sm z-10">
        <div className="p-4 border-b bg-white">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Pesan Masuk</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari user..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Belum ada pesan.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.uid}
                onClick={() => setSelectedUid(user.uid)}
                className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${selectedUid === user.uid
                  ? "bg-blue-50 border-l-4 border-l-blue-600"
                  : "border-l-4 border-l-transparent"
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className={`font-semibold text-sm truncate pr-2 ${selectedUid === user.uid ? 'text-blue-700' : 'text-gray-900'}`}>
                    {user.meta.userName}
                  </p>
                  {user.meta.timestamp > 0 && (
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {new Date(user.meta.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate w-3/4">
                    {user.meta.lastMessage}
                  </p>
                  {user.meta.unreadCount ? (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {user.meta.unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-[#F8FAFC]">
        {selectedUid ? (
          <>
            <div className="p-4 bg-white border-b shadow-sm flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {activeUser?.meta.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-sm">
                    {activeUser?.meta.userName}
                  </h2>
                  {activeUser?.meta.userEmail && (
                    <p className="text-xs text-gray-500">{activeUser.meta.userEmail}</p>
                  )}
                </div>
              </div>
              <button
                onClick={requestDeleteChat}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                title="Hapus Seluruh Sesi Chat"
              >
                <Trash2 size={14} />
                Hapus Sesi
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">
                  Belum ada pesan di percakapan ini.
                </div>
              )}
              {messages.map((msg, i) => {
                const isAdmin = msg.sender === "admin";
                return (
                  <div
                    key={msg.id || i}
                    className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${isAdmin
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                        }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-[10px] mt-1 ${isAdmin ? "text-blue-100 text-right" : "text-gray-400 text-left"
                          }`}
                      >
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : '...'}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-white border-t flex gap-3 items-center">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Tulis balasan anda..."
                className="flex-1 border border-gray-200 bg-gray-50 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <button
                onClick={handleSend}
                disabled={loading || !replyText.trim()}
                className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Send className="h-5 w-5" />}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <User className="h-12 w-12 text-gray-300" />
            </div>
            <p className="font-medium">Pilih percakapan untuk memulai chat</p>
          </div>
        )}
      </div>
    </div>
  );
}

