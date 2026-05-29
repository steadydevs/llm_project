import axios from "axios";

console.log(import.meta.env.VITE_API_URL)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
});

export interface ChatResponse {
  response: string;
}

export const sendChatMessage = async (
  input: string,
  userId: string,
): Promise<string> => {
  const response = await api.post<ChatResponse>("/chat", {
    input,
    user_id: userId,
  });
  return response.data.response;
};
