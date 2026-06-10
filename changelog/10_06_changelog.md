# Histórico de modificações do projeto

|    Data    | Modificação                                                        | Autor | Motivo                                                       |
| :--------: | :----------------------------------------------------------------- | :---: | :----------------------------------------------------------- |
| 10/06/2026 | Adicionado suporte a múltiplos modos de chat na API (`chat_mode`). | Diogo | Permitir que o usuário escolha o modo de jogo dinamicamente. |

### 'chat_routes.py'

#### Adicionado:

- 'chat_mode:str' na classe 'ChatRequest'
- passagem dinâmica do modo de chat no inicializador do agente

```python
class ChatRequest(BaseModel):
    input: str
    user_id: str
    chat_mode: str # <---- novo campo

@router.post("/chat")
async def handle_chat_message(request: ChatRequest):
    try:
        agent_executor = get_game_agent_executor(mode=request.chat_mode) # <---- paggasem dinamica
        result = agent_executor.invoke({
            "input": request.input,
            "user_id": request.user_id
        })
        return {"response": result["output"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### api.ts

#### Adicionado

- chatMode: string nas propriedades da função

```python
import axios from "axios";

console.log(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
});

export interface ChatResponse {
  response: string;
}

export const sendChatMessage = async (
  input: string,
  userId: string,
  chatMode: string, # <------- adiconado
): Promise<string> => {
  const response = await api.post<ChatResponse>("/chat", {
    input,
    user_id: userId,
    chat_mode: chatMode, # <------ adicionado
  });
  return response.data.response;
};

```

### Messages.tsx

#### Modificado

- MESSAGE_COMPONENTS agora tem "Chat Supabase" e "Chat RawgAPI", que é selecionado dinamicamente via dicionário

```python
import { useState } from "react";
import { Search, Settings } from "lucide-react";
import { FilterButton } from "../../Ui/FilterButton.tsx";
import { ChatbotRawgAPI } from "./ChatbotRawgAPI.tsx";
import ChatbotSupabase from "./ChatbotSupabase.tsx";

const MESSAGE_COMPONENTS: Record<string, React.FC> = {
  "Chat Supabase": ChatbotSupabase,
  "Chat RawgAPI": ChatbotRawgAPI,
};

export const Messages = () => {
  const [activeFilter, setActiveFilter] = useState("Chat Supabase");
  const ActiveComponent = MESSAGE_COMPONENTS[activeFilter];

  return (
    <div className="h-screen flex flex-col bg-white px-6 pt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Messages</h1>
        <div className="flex gap-4">
          <Search className="size-6 text-neutral-900" />
          <Settings className="size-6 text-neutral-900" />
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        {["Chat Supabase", "Chat RawgAPI"].map((filter) => (
          <FilterButton
            key={filter}
            label={filter}
            isActive={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          />
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        <ActiveComponent />
      </div>
    </div>
  );
};


```

### chamadas de ChatborChatMessage e ChatRawgAPI

#### Modificado

- Os componentes React agora chamam os respectivos componentes ChatbotSupabase e ChatRawgAPI

```python
import { ChatbotSupabase } from "../ChatbotSupabase";

export const ChatbotChatMessage = () => (
  <div className="space-y-6">
    <ChatbotSupabase />
  </div>
);

export default ChatbotChatMessage;

```

```python
import ChatbotRawgAPI from "../ChatbotRawgAPI";

export const ChatRawgAPI = () => (
  <div className="space-y-6">
    <ChatbotRawgAPI />
  </div>
);

export default ChatRawgAPI;


```

### Chamada dos chats via front

#### Modificado

##### ChatbotSupabase e ChatRawgAPI

- texto de mensagem em messages adaptado para cada chat
- modo ChatSupabase//ChatRawgAPI adicionado em botResponseText

```python
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { sendChatMessage } from "../../../services/api";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const LOGGED_IN_USER_ID = "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d";

export const ChatbotSupabase = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá, Diogo! Sou o assistente do NetPlay. Como posso te ajudar com trocas ou aluguéis de jogos hoje?", #<----- modificado
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
      // Enviando o identificador do banco de dados na rota única
      const botResponseText = await sendChatMessage(
        userMessageText,
        LOGGED_IN_USER_ID,
        "ChatSupabase", #<----- adicionado
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
      {/* Área de Mensagens */}
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
              className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === "user" ? "bg-neutral-700" : "bg-primary"
              }`}
            >
              {msg.sender === "user" ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>

            {/* Balão de Texto */}
            <div
              className={`px-4 py-3 rounded-2xl text-sm ${
                msg.sender === "user"
                  ? "bg-neutral-700 text-white"
                  : "bg-neutral-100 text-neutral-900 border border-neutral-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Indicador de Carregamento */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-neutral-100 text-neutral-500 text-sm animate-pulse">
              Consultando a vizinhança...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input de Mensagem */}
      <footer className="p-4 border-t border-neutral-100 bg-white mb-8">
        <form
          onSubmit={handleSendMessage}
          className="flex gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-full bg-neutral-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-primary text-sm text-neutral-900 placeholder-neutral-400"
            placeholder="Pergunte sobre jogos perto de você ou sua reputação..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-full bg-primary text-white disabled:opacity-50 transition-opacity hover:opacity-90 flex items-center justify-center shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatbotSupabase;

```

```python
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
      text: "Olá! Sou o assistente de recomendação de jogos. Pergunte qualquer coisa sobre títulos, plataformas, avaliações e datas de lançamento de jogos que você tem em mente.", #<----- modificado
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
      // Enviando o identificador "ChatRawgAPI" na rota única
      const botResponseText = await sendChatMessage(
        userMessageText,
        LOGGED_IN_USER_ID,
        "ChatRawgAPI", #<----- adicionado
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
      {/* Área de Mensagens */}
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
              className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === "user" ? "bg-neutral-700" : "bg-primary"
              }`}
            >
              {msg.sender === "user" ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>

            {/* Balão de Texto */}
            <div
              className={`px-4 py-3 rounded-2xl text-sm ${
                msg.sender === "user"
                  ? "bg-neutral-700 text-white"
                  : "bg-neutral-100 text-neutral-900 border border-neutral-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Indicador de Carregamento Customizado para RAWG */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-neutral-100 text-neutral-500 text-sm animate-pulse">
              Consultando a enciclopédia de jogos...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input de Mensagem */}
      <footer className="p-4 border-t border-neutral-100 bg-white mb-8">
        <form
          onSubmit={handleSendMessage}
          className="flex gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-full bg-neutral-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-primary text-sm text-neutral-900 placeholder-neutral-400"
            placeholder="Busque por Elden Ring, GTA VI, notas, plataformas..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-full bg-primary text-white disabled:opacity-50 transition-opacity hover:opacity-90 flex items-center justify-center shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatbotRawgAPI;

```

### 'game_agent.py

### antigo

```python
import json
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import AIMessage, ToolMessage
from src.tools.database_tools import get_account_info, search_local_games
from src.tools.rawg_tools import search_rawg_games

class NativeToolAgent:
    """Executor robusto e imutável que usa o mecanismo nativo de Tool Calling da OpenAI."""
    def __init__(self, model, tools):
        self.model = model.bind_tools(tools)
        self.tools_map = {tool.name: tool for tool in tools}

    def invoke(self, inputs: dict) -> dict:
        user_id = inputs["user_id"]
        user_input = inputs["input"]

        # prompt_template = ChatPromptTemplate.from_messages([
        #     # ("system", """
        #     #     You are a smart assistant focused on a peer-to-peer (P2P) collaborative economy for physical game media.
        #     #     Your role is to help players rent or trade PS5 and Nintendo Switch games with people in their region.
        #     #     Always use the available tools to contextualize your answers based on the user's location and data.
        #     #     The current user ID in all tool calls must be: {user_id}.
        #     #     Always be friendly, use inclusive language, and adopt terms from the gaming ecosystem.
        #     # """),
        #     ("system",
        #      """
        #         You are a game search assistant that must use the RAWG API tool
        #         for any request about video game titles, platforms, release dates,
        #         ratings, or series information.
        #         Do not answer game catalog questions from memory or general knowledge.
        #         Use only the `search_rawg_games` tool for game-related searches.
        #     """),
        prompt_template = ChatPromptTemplate.from_messages([
                ("system", """
                Você é um assistente de jogos.
                - Se o chat_history mostrar que uma ferramenta já foi usada e retornou dados, NÃO a chame novamente.
                - Use os dados recebidos no chat_history para redigir uma resposta final em português.
                - Se a ferramenta retornar erro ou nenhum jogo, avise o usuário.
                """),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}")
        ])

        # prompt = prompt_template.partial(user_id=user_id, input=user_input)
        prompt = prompt_template
        chat_history = []

        iteration = 0
        max_iteration = 5


        while iteration < max_iteration:
            print(f"Executando iteração {iteration + 1}", flush=True)
            messages = prompt.format_messages(
                chat_history=chat_history,
                user_id = user_id,
                input = user_input
                )
            print(f"DEBUG: O histórico atual possui {len(chat_history)} mensagens.")
            response = self.model.invoke(messages)

            if not response.tool_calls:
                return {"output": response.content}

            chat_history.append(
                                AIMessage(
                                    content=response.content,
                                    tool_calls=response.tool_calls,
                                    additional_kwargs={"tool_calls": response.tool_calls}
                                )
                            )


            # Executa ferramentas
            for tool_call in response.tool_calls:
                tool_name = tool_call["name"]
                tool_args = tool_call["args"]
                tool_id = tool_call["id"]

                tool_to_call = self.tools_map.get(tool_name)
                if tool_to_call:
                    print(f"\n[AGENT] Executando ferramenta: {tool_name} com argumentos {tool_args}", flush=True)
                    try:
                        tool_output = tool_to_call.invoke(tool_args)

                    except Exception as e:
                        # tool_output = f"Erro interno na ferramenta: {str(e)}"
                        tool_output = {"error": str(e)}
                else:
                    # tool_output = f"Error: Tool '{tool_name}' not found."
                    tool_output = {"error": f"Tool '{tool_name}' not found."}


                chat_history.append(
                    ToolMessage(
                        content=json.dumps(tool_output, ensure_ascii=False),
                        tool_call_id=tool_id
                    )
                )

            iteration += 1


def get_game_agent_executor(mode:str):
    model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    if mode == 'ChatRawgAPI':
        tools = [search_rawg_games]
    else:
        tools = [get_account_info, search_local_games]

    return NativeToolAgent(model=model, tools=tools)

```

### novo

```python
import json
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import AIMessage, ToolMessage
from src.tools.database_tools import get_account_info, search_local_games
from src.tools.rawg_tools import search_rawg_games

class NativeToolAgent:
    """Executor dinâmico que adapta ferramentas e prompts de acordo com o propósito do chat."""
    def __init__(self, model, tools, system_prompt: str):
        self.model = model.bind_tools(tools)
        self.tools_map = {tool.name: tool for tool in tools}
        self.system_prompt = system_prompt

    def invoke(self, inputs: dict) -> dict:
        user_id = inputs["user_id"]
        user_input = inputs["input"]

        prompt_template = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}")
        ])

        chat_history = []
        iteration = 0
        max_iteration = 5

        while iteration < max_iteration:
            print(f"Executando iteração {iteration + 1}", flush=True)

            messages = prompt_template.format_messages(
                chat_history=chat_history,
                user_id=user_id,
                input=user_input
            )

            response = self.model.invoke(messages)

            if not response.tool_calls:
                return {"output": response.content}

            chat_history.append(
                AIMessage(
                    content=response.content,
                    tool_calls=response.tool_calls,
                    additional_kwargs={"tool_calls": response.tool_calls}
                )
            )

            for tool_call in response.tool_calls:
                tool_name = tool_call["name"]
                tool_args = tool_call["args"]
                tool_id = tool_call["id"]
                tool_to_call = self.tools_map.get(tool_name)

                if tool_to_call:
                    print(f"\n[AGENT] Executando ferramenta: {tool_name} com argumentos {tool_args}", flush=True)
                    try:
                        if "user_id" in tool_to_call.args and "user_id" not in tool_args:
                            tool_args["user_id"] = user_id
                        tool_output = tool_to_call.invoke(tool_args)
                    except Exception as e:
                        tool_output = {"error": str(e)}
                else:
                    tool_output = {"error": f"Tool '{tool_name}' not found."}

                chat_history.append(
                    ToolMessage(
                        content=json.dumps(tool_output, ensure_ascii=False),
                        tool_call_id=tool_id
                    )
                )
            iteration += 1

def get_game_agent_executor(mode: str):
    model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    if mode == "ChatRawgAPI":
        tools = [search_rawg_games]
        system_prompt = """
        Você é o assistente de recomendação de jogos. Seu único propósito é ajudar o usuário a descobrir informações sobre o mercado geral de games.
        - Se o chat_history mostrar que uma ferramenta já foi usada e retornou dados, NÃO a chame novamente.
        - Use os dados recebidos no chat_history para redigir uma resposta final em português.
        - Se a ferramenta retornar erro ou nenhum jogo, avise o usuário.
        - Use OBRIGATORIAMENTE a ferramenta `search_rawg_games` para qualquer questão sobre títulos, notas, plataformas ou estúdios.
        - Nunca cite informações sobre usuários locais, reputação ou distâncias geográficas neste chat, pois você não tem acesso ao banco de dados aqui.
        """
    else:
        tools = [get_account_info, search_local_games]
        system_prompt = """
        Você é o assistente com acesso ao banco de dados dos usuários. Seu propósito é ajudar jogadores a trocarem ou alugarem mídias físicas na região deles.
        - Você tem acesso direto ao banco de dados através das ferramentas de conta e busca local.
        - Sempre use a ferramenta `get_account_info` ou `search_local_games` para embasar suas respostas com dados reais do Supabase/PostGIS.
        - Adote termos do ecossistema gamer, use linguagem inclusiva e seja focado na comunidade P2P local.
        - O ID do usuário logado é disponibilizado automaticamente nas ferramentas.
        - Se o usuário pedir detalhes técnicos globais ou notas de jogos que não estão no inventário local, avise gentilmente que ele pode consultar a aba 'Chat RawgAPI' para uma busca global.
        """

    return NativeToolAgent(model=model, tools=tools, system_prompt=system_prompt)

```

### database_tools change

#### Fixed: get_account_info não estava recebendo o user_id

```python
@tool
def get_account_info(user_id: str) -> str:
    """Returns the account and profile information of the logged-in user directly from the database."""

    if user_id == "user_id" or not user_id:  # <------------ MUDANÇA: verificação mais explícita (a LLM estava recebendo uma string listeral do user_id)
        return "Erro: O ID do usuário não foi enviado corretamente"

    try:
        conn = get_database_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT name, reputation, city, platforms FROM users WHERE id = %s;", (user_id,))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        if result:
            name, reputation, city, platforms = result
            return {
                "user": {
                    "name": name,
                    "reputation": float(reputation),
                    "city": city,
                    "platforms": platforms or []
                }
            }

        return {
            "user": None,
            "message": "User not found"
        }
    except Exception as e:
        print(f"[DEBUG NETPLAY] Erro ao acessar o banco de dados: {str(e)}")
        return {
            "error": f"Error accessing the database: {str(e)}"
        }

```

#### Fixed: search_local_games: faltava adicionar os jogos encontrados à lista

```python

@tool
def search_local_games(user_id: str) -> str:
    """Searches for physical games available for trade/rent within a 10km radius of the user, excluding their own."""
    try:
        conn = get_database_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT catalog.title, catalog.platform, inventory.condition, owner.name,
            ST_Distance(owner.location, searcher.location) as distance
            FROM user_inventory AS inventory
            JOIN game_catalog AS catalog ON inventory.game_id = catalog.id
            JOIN users AS owner ON inventory.user_id = owner.id
            CROSS JOIN (SELECT location FROM users WHERE
            id='a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d') AS searcher
            WHERE inventory.status = 'AVAILABLE'
            AND owner.id != 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'
            AND ST_DWithin(owner.location, searcher.location, 10000)
            ORDER BY distance ASC;
        """, (user_id, user_id))

        games_found = cursor.fetchall()

        cursor.close()
        conn.close()

        games = []

        if games_found:
            for title, platform, condition, owner, distance in games_found:
                games.append({
                    "title": title,
                    "platform": platform,
                    "condition": condition,
                    "owner": owner,
                    "distance_km": round(distance / 1000, 1)
                })

        if games: # <--------- ADICIONADO: faltava adicionar os jogos à lista
            response_text = 'Jogos encontrados:\n'
            for g in games:
                response_text += f"- {g['title']} ({g['platform']}) | Condição: {g['condition']} | Distância: {g['distance_km']}km | Dono: {g['owner']}\n"
            return response_text

        return "Nenhum jogo físico encontrado disponível para troca ou aluguel em um raio de 10km no momento."

    except Exception as e:
        print(f" [DEBUG NETPLAY] Erro crítico na ferramenta: {str(e)}")
        return {
            "error":"Error during local search: {e}"
            }

```
