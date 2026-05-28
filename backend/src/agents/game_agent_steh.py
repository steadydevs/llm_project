# backend/src/agents/game_agent.py
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor

# 1. Importa a ferramenta do LangChain que criamos juntos no Passo 3!
from ..tools.database_tools import game_search_tool

load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')

if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in the environment variables.")

# 2. Inicializa o cérebro (OpenAI)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2, api_key=api_key)

prompt_template = ChatPromptTemplate.from_messages([
            ("system", """
                You are a smart assistant focused on a peer-to-peer (P2P) collaborative economy for physical game media.
                Your role is to help players trade physical games with people in their region.
                Always use the available tools to contextualize your answers based on the user's location and data.
                The current user ID in all tool calls must be: {user_id}.
                Always be friendly, use inclusive language, and adopt terms from the gaming ecosystem.
            """),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}")
        ])

# 3. Lista de ferramentas que a OpenAI terá acesso (A sua está aqui!)
tools = [game_search_tool]

# 4. Criamos a "Personalidade" da IA (O Prompt do Sistema)
prompt = ChatPromptTemplate.from_messages([
    ("system", """Você é o NetPlay, um assistente inteligente especialista em videogames e recomendações de jogos.
    
    Sua missão é conversar com o usuário de forma amigável e ajudá-lo a descobrir jogos, verificar faixas etárias (público recomendado), estúdios e onde baixar.
    
    REGRAS DE OURO:
    1. Se o usuário perguntar sobre jogos, lançamentos, estúdios ou detalhes técnicos, use SEMPRE a ferramenta 'buscar_informacoes_de_jogos'.
    2. Nunca tente adivinhar dados de jogos da sua cabeça. Use a ferramenta para extrair os dados reais da RAWG.
    3. Quando o usuário pedir recomendações por faixa etária (ex: 'jogos para maiores de 18' ou 'jogos livres'), use a ferramenta para buscar os termos/jogos e filtre os resultados usando o campo 'Público recomendado' trazido pela ferramenta.
    """),
    # Permite que a IA lembre do histórico da conversa se o front enviar
    MessagesPlaceholder(variable_name="chat_history", optional=True),
    # Onde entra a pergunta atual do usuário
    ("human", "{input}"),
    # Espaço reservado para o LangChain gerenciar os pensamentos da IA
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# 5. Cria o Agente que sabe ligar para as ferramentas (Tool Calling Agent)
agent = create_tool_calling_agent(llm, tools, prompt)

# 6. O Executor é o "motor" que roda o agente e executa as buscas de fato
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)