from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import AIMessage, ToolMessage
from src.tools.database_tools import get_account_info, search_local_games

class NativeToolAgent:
    """Executor robusto e imutável que usa o mecanismo nativo de Tool Calling da OpenAI."""
    def __init__(self, model, tools):
        self.model = model.bind_tools(tools)
        self.tools_map = {tool.name: tool for tool in tools}

    def invoke(self, inputs: dict) -> dict:
        user_id = inputs["user_id"]
        user_input = inputs["input"]

        prompt_template = ChatPromptTemplate.from_messages([
            ("system", """
                You are a smart assistant focused on a peer-to-peer (P2P) collaborative economy for physical game media.
                Your role is to help players rent or trade PS5 and Nintendo Switch games with people in their region.
                Always use the available tools to contextualize your answers based on the user's location and data.
                The current user ID in all tool calls must be: {user_id}.
                Always be friendly, use inclusive language, and adopt terms from the gaming ecosystem.
            """),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}")
        ])

        prompt = prompt_template.partial(user_id=user_id, input=user_input)
        chat_history = []

        while True:
            messages = prompt.format_messages(chat_history=chat_history)
            response = self.model.invoke(messages)

            if not response.tool_calls:
                return {"output": response.content}

            chat_history.append(response)

            for tool_call in response.tool_calls:
                tool_name = tool_call["name"]
                tool_args = tool_call["args"]
                tool_id = tool_call["id"]

                tool_to_call = self.tools_map.get(tool_name)
                if tool_to_call:
                    print(f"\n[AGENT] Executando ferramenta: {tool_name} com argumentos {tool_args}")
                    tool_output = tool_to_call.invoke(tool_args)
                else:
                    tool_output = f"Error: Tool '{tool_name}' not found."

                chat_history.append(ToolMessage(content=str(tool_output), tool_call_id=tool_id))

def get_game_agent_executor():
    model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    tools = [get_account_info, search_local_games]
    
    return NativeToolAgent(model=model, tools=tools)



#from src.tools.game_tools import game_search_tool

# Eles vão injetar a tua ferramenta na lista de ferramentas do Agente do LangChain:
#tools = [game_search_tool]
# E o Ollama saberá chamar o teu código sempre que o utilizador perguntar por um jogo!