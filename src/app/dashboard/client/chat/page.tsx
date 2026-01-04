"use strict";
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import { ref, push, onValue, serverTimestamp, update, off } from "firebase/database";
import { Send, Loader2, User, Bot } from "lucide-react";

interface Message {
    id: string;
    text: string;
    sender: "client" | "admin";
    timestamp: number;
}

export default function ChatPage() {
    const { data: session, status } = useSession();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const userId = session?.user?.id; // Assuming user ID is available in session

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (status === "loading") return;
        if (!userId) {
            setLoading(false);
            return;
        }

        const messagesRef = ref(db, `chata/${userId}/messages`);

        const listener = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedMessages = Object.entries(data).map(([key, value]: [string, any]) => ({
                    id: key,
                    ...value,
                }));
                // Sort by timestamp just in case
                loadedMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
                setMessages(loadedMessages);
            } else {
                setMessages([]);
            }
            setLoading(false);
        });

        return () => {
            off(messagesRef, "value", listener);
        };
    }, [userId, status]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !userId) return;

        const messageText = input.trim();
        setInput(""); // Clear input immediately

        try {
            // 1. Push message
            const messagesRef = ref(db, `chata/${userId}/messages`);
            await push(messagesRef, {
                text: messageText,
                sender: "client",
                timestamp: serverTimestamp(),
            });

            // 2. Update metadata for Admin list
            const metaRef = ref(db, `chata/${userId}/meta`);
            await update(metaRef, {
                lastMessage: messageText,
                timestamp: serverTimestamp(),
                userName: session?.user?.name || "Client",
                userEmail: session?.user?.email || "",
                unreadCount: 1,
            });
        } catch (error) {
            console.error("Error sending message:", error);
            // Optional: Show error toast
        }
    };

    if (status === "loading") {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="p-6 text-center text-gray-500">
                Please sign in to chat with support.
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                    <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="font-semibold text-gray-900">Support Team</h2>
                    <p className="text-xs text-gray-500">We usually reply within a few minutes</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {loading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                        <p>Start a conversation with us!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isClient = msg.sender === "client";
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isClient ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isClient
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                    <span
                                        className={`text-[10px] mt-1 block w-full text-right ${isClient ? "text-blue-100" : "text-gray-400"
                                            }`}
                                    >
                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="flex items-center justify-center rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}

