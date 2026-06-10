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


