import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { sendChatMessage } from "../services/api";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const LOGGED_IN_USER_ID = "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d";

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá, Diogo! Sou o assistente do NetPlay. Como posso te ajudar com trocas ou aluguéis de jogos hoje?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageText = input;
    setInput("");

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: "user",
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setIsLoading(true);

    try {
      const botResponseText = await sendChatMessage(
        userMessageText,
        LOGGED_IN_USER_ID,
      );

      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: "bot",
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Erro ao falar com a API do NetPlay:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Ops, tive um problema para me conectar ao servidor. Verifique se o back-end está ligado!",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] bg-white overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 space-y-4 ">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
          >
            <div
              className={`size-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-neutral-700" : "bg-primary"}`}
            >
              {msg.sender === "user" ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>
            <div
              className={`px-4 py-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-neutral-700 text-white" : "bg-neutral-100 text-neutral-900 border border-neutral-200"}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-neutral-100 text-neutral-500 text-sm">
              Consultando...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-neutral-100 bg-white mb-8">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-full bg-neutral-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-primary"
            placeholder="Mensagem..."
          />
          <button
            type="submit"
            className="p-3 rounded-full bg-primary text-white disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chatbot;
