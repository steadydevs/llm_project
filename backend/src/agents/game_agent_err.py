# from langchain_openai import ChatOpenAI
# from langchain_core.prompts import ChatPromptTemplate


# from langchain.agents import AgentExecutor, create_tool_calling_agent
# from langchain.agents import create_tool_calling_agent
# from langchain_community.agent_toolkits.load_tools import AgentExecutor
# from langchain.agents.tool_calling_agent.base import create_tool_calling_agent
# from langchain.agents.agent import AgentExecutor
# from langchain.agents.format_scratchpad.openai_tools import format_to_openai_tool_messages
# from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser


# from src.tools.database_tools import get_account_info, search_local_games


# def get_game_agent_executor():
#     model = ChatOpenAI(model="gpt-4o-mini")
#     tools = [get_account_info, search_local_games]

#     prompt = ChatPromptTemplate.from_messages([
#     ("system", """
#             You are a smart assistant focused on a peer-to-peer (P2P) collaborative economy for physical game media.
#             Your role is to help players rent or trade PS5 and Nintendo Switch games with people in their region.
#             Always use the available tools to contextualize your answers based on the user's location and data.
#             The current user ID in all tool calls must be: {user_id}.
#             Always be friendly, use inclusive language, and adopt terms from the gaming ecosystem.
#         """),
#         ("human", "{input}"),
#         ("placeholder", "{agent_scratchpad}"),
#     ])

#     agent = create_tool_calling_agent(model, tools, prompt)
#     agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# from langchain_openai import ChatOpenAI
# from langchain_core.prompts import ChatPromptTemplate
# from langchain.agents.format_scratchpad.openai_tools import format_to_openai_tool_messages
# from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser

# # O CAMINHO CORRETO E MODERNO DO EXECUTOR EM PROJETOS ATUAIS:
# from langchain.agents.agent_iterator import AgentExecutor
# from langchain.agents import AgentExecutor

# # Importando as ferramentas criadas no seu módulo de banco
# from src.tools.database_tools import get_account_info, search_local_games
# # Importando as ferramentas criadas no seu módulo de banco
# from src.tools.database_tools import get_account_info, search_local_games

# def get_game_agent_executor():
#     # 1. Inicializa o modelo de linguagem
#     llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
#     tools = [get_account_info, search_local_games]

#     # 2. Configura o prompt
#     prompt = ChatPromptTemplate.from_messages([
#        ("system", """
#             You are a smart assistant focused on a peer-to-peer (P2P) collaborative economy for physical game media.
#             Your role is to help players rent or trade PS5 and Nintendo Switch games with people in their region.
#             Always use the available tools to contextualize your answers based on the user's location and data.
#             The current user ID in all tool calls must be: {user_id}.
#             Always be friendly, use inclusive language, and adopt terms from the gaming ecosystem.
#         """),
#         ("human", "{input}"),
#         ("placeholder", "{agent_scratchpad}"),
#     ])

#     # 3. Vincula as ferramentas nativamente ao modelo e monta a LCEL (LangChain Expression Language)
#     llm_with_tools = llm.bind_tools(tools)
    
#     agent = (
#         # Preenche as variáveis (user_id, input, agent_scratchpad) no prompt
#         prompt 
#         # Formata o histórico de chamadas de ferramentas no formato correto da OpenAI
#         | {
#             "input": lambda x: x["input"],
#             "user_id": lambda x: x["user_id"],
#             "agent_scratchpad": lambda x: format_to_openai_tool_messages(x["steps"])
#         }
#         # Passa pelo prompt, pelo modelo com ferramentas vinculadas e faz o parse da saída
#         | prompt 
#         | llm_with_tools 
#         | OpenAIToolsAgentOutputParser()
#     )

#     return AgentExecutor(agent=agent, tools=tools, verbose=True)