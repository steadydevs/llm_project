import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { sendChatMessage } from "../../../services/api";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const LOGGED_IN_USER_ID = "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d";

export const ChatbotRawgAPI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou o assistente de recomendação de jogos. Pergunte qualquer coisa sobre títulos, plataformas, avaliações e datas de lançamento de jogos que você tem em mente.",
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
        "ChatRawgAPI",
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

  // Helper to parse **bold** tags
  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-bold text-neutral-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Rich rendering of chatbot texts to display lists and games beautifully
  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    
    return (
      <div className="space-y-2">
        {lines.map((line, idx) => {
          // Bullet list parsing
          const bulletMatch = line.match(/^[-*]\s*(.*)/);
          if (bulletMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2 my-1 text-sm text-neutral-800 leading-relaxed">
                <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span className="flex-1 whitespace-pre-wrap">{parseBoldText(bulletMatch[1])}</span>
              </div>
            );
          }

          // Number list parsing
          const numMatch = line.match(/^(\d+)\.\s*(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2 my-1 text-sm text-neutral-800 leading-relaxed">
                <span className="text-primary font-bold text-xs mt-1 shrink-0">{numMatch[1]}.</span>
                <span className="flex-1 whitespace-pre-wrap">{parseBoldText(numMatch[2])}</span>
              </div>
            );
          }

          if (!line.trim()) return <div key={idx} className="h-1" />;
          return (
            <p key={idx} className="text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
              {parseBoldText(line)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] bg-neutral-50 rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
      {/* Messages Feed Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className={`size-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.sender === "user" ? "bg-neutral-800" : "bg-primary text-white"
              }`}
            >
              {msg.sender === "user" ? (
                <User size={16} />
              ) : (
                <Bot size={16} />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`px-4 py-3 rounded-2xl shadow-sm border ${
                msg.sender === "user"
                  ? "bg-neutral-800 text-white border-neutral-800 rounded-tr-none"
                  : "bg-white text-neutral-900 border-neutral-200 rounded-tl-none"
              }`}
            >
              {msg.sender === "user" ? (
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              ) : (
                renderMessageContent(msg.text)
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
              <Bot size={16} className="animate-pulse" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white border border-neutral-200 text-neutral-500 text-sm flex items-center gap-2 shadow-sm">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce" />
              </div>
              <span className="font-medium">Consultando a enciclopédia de jogos...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Message Input Footer */}
      <footer className="p-4 border-t border-neutral-200 bg-white">
        <form
          onSubmit={handleSendMessage}
          className="flex gap-2 max-w-4xl mx-auto relative items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 pl-5 pr-14 py-3 rounded-full bg-neutral-50 border border-neutral-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-neutral-900 placeholder-neutral-400 transition-all"
            placeholder="Busque por Elden Ring, GTA VI, notas, plataformas..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-1.5 bg-primary text-white disabled:opacity-40 transition-all hover:bg-red-700 p-2.5 rounded-full flex items-center justify-center shrink-0 shadow-sm active:scale-95"
          >
            <Send size={16} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatbotRawgAPI;
