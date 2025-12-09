"use client";

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, push, update, remove, serverTimestamp } from 'firebase/database';
import type { ChatClient, ChatMessage } from '@/lib/types';

// PERUBAHAN DI SINI: Tambahkan 'default' dan ganti nama jadi CSChatPage (opsional tapi rapi)
export default function CSChatPage() {
    const [clients, setClients] = useState<ChatClient[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Listen ke Daftar Chat (Sidebar)
    useEffect(() => {
        // Pastikan 'db' sudah terinisialisasi di lib/firebase.ts
        const chatsRef = ref(db, 'chats');
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
            // Sort biar chat terbaru di atas (opsional)
            setClients(loadedClients.reverse());
        });

        return () => unsubscribe();
    }, []);

    // 2. Listen ke Isi Chat (Main Area)
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
                        senderId: m.sender === 'user' ? selectedClientId : 'admin',
                        senderName: m.sender === 'user' ? 'Client' : 'Admin',
                        message: m.text,
                        timestamp: m.time || new Date(m.timestamp).toLocaleTimeString(),
                        isAdmin: m.sender === 'agent'
                    });
                });
            }
            setMessages(loadedMessages);
            
            // Auto scroll ke bawah
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });

        return () => unsubscribe();
    }, [selectedClientId]);

    const handleSendMessage = () => {
        if (!inputText.trim() || !selectedClientId) return;

        const chatRef = ref(db, `chats/${selectedClientId}/messages`);
        push(chatRef, {
            sender: 'agent',
            text: inputText,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date().toISOString()
        });

        // Update Metadata (Last message di sidebar)
        update(ref(db, `chats/${selectedClientId}/meta`), {
            lastMessage: `Admin: ${inputText}`,
            lastTimestamp: serverTimestamp()
        });

        setInputText("");
    };

    const handleDeleteChat = () => {
        if(!selectedClientId) return;
        if(confirm("Hapus history chat ini selamanya?")) {
            remove(ref(db, `chats/${selectedClientId}`));
            setSelectedClientId(null);
            setMessages([]);
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] border rounded-lg overflow-hidden bg-white">
            {/* Sidebar List Client */}
            <div className="md:col-span-1 border-r bg-gray-50 overflow-y-auto">
                <div className="p-4 border-b font-bold text-gray-700">Antrian Chat</div>
                {clients.length === 0 && <p className="p-4 text-sm text-gray-500">Belum ada pesan.</p>}
                {clients.map(client => (
                    <div 
                        key={client.id}
                        onClick={() => setSelectedClientId(client.id)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${selectedClientId === client.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                    >
                        <div className="flex justify-between items-start">
                            <span className="font-semibold text-gray-900">{client.name}</span>
                            {client.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{client.unreadCount}</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-1">{client.lastMessage}</p>
                    </div>
                ))}
            </div>

            {/* Chat Area */}
            <div className="md:col-span-2 flex flex-col h-full">
                {selectedClientId ? (
                    <>
                        <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm">
                            <h4 className="font-bold">Chatting dengan Client</h4>
                            <button onClick={handleDeleteChat} className="text-red-500 text-sm hover:underline">Hapus Sesi</button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-lg p-3 ${msg.isAdmin ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                                        <p className="text-sm">{msg.message}</p>
                                        <p className={`text-[10px] mt-1 ${msg.isAdmin ? 'text-blue-200' : 'text-gray-400'}`}>{msg.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t bg-white">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ketik balasan..."
                                    className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
                                >
                                    Kirim
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
                        <p>Pilih client di sebelah kiri untuk mulai chat.</p>
                    </div>
                )}
            </div>
        </div>
    );
}