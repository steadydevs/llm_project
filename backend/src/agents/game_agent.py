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


def get_game_agent_executor():
    model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    # tools = [get_account_info, search_local_games, search_rawg_games]
    tools = [search_rawg_games]
    
    return NativeToolAgent(model=model, tools=tools)
