import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Gamepad2, MapPin } from "lucide-react";
import { sendChatMessage } from "../../../services/api";
import { useAppContext } from "../../../context/AppContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const LOGGED_IN_USER_ID = "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d";

export const ChatbotSupabase = () => {
  const { availableGames, requestGame } = useAppContext();
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
        "ChatSupabase",
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

  // Rich rendering of chatbot texts to display lists and games as premium cards
  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    
    return (
      <div className="space-y-2">
        {lines.map((line, idx) => {
          // Detect local game format: "- Title (Platform) | Condição: X | Distância: Ykm | Dono: Z"
          const gameMatch = line.match(/^-\s*(.*?)\s*\((.*?)\)\s*\|\s*Condição:\s*(.*?)\s*\|\s*Distância:\s*(.*?)\s*\|\s*Dono:\s*(.*)/i);
          
          if (gameMatch) {
            const [_, title, platform, condition, distance, owner] = gameMatch;
            
            // Look up in AppContext to find game ID and allow Human-in-the-loop requests
            const matchedGame = availableGames.find(
              (g) => g.title.toLowerCase() === title.trim().toLowerCase() && g.platform === platform.trim()
            );

            return (
              <div
                key={idx}
                className="my-3 bg-white p-3 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                      platform.includes("Switch") ? "bg-red-50 text-red-600 border-red-100" :
                      platform.includes("PS5") ? "bg-blue-50 text-blue-600 border-blue-100" :
                      "bg-neutral-50 text-neutral-600 border-neutral-100"
                    }`}>
                      {platform}
                    </span>
                    <h4 className="font-bold text-neutral-800 text-xs truncate">{title}</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] text-neutral-500 font-medium">
                    <span className="flex items-center gap-1">📍 {distance}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                    <span>Est: <span className="font-semibold text-neutral-700">{condition}</span></span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                    <span>Dono: <span className="font-semibold text-neutral-700">{owner}</span></span>
                  </div>
                </div>
                
                {matchedGame && (
                  <button
                    onClick={() => requestGame(matchedGame.id, "trade")}
                    className="bg-primary hover:bg-red-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-sm transition-all shrink-0 active:scale-95"
                  >
                    Solicitar
                  </button>
                )}
              </div>
            );
          }

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
              <span className="font-medium">Consultando a vizinhança...</span>
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
            placeholder="Pergunte sobre jogos perto de você ou sua reputação..."
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

export default ChatbotSupabase;
