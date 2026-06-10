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
        {ActiveComponent ? (
          <ActiveComponent />
        ) : (
          <p>Componente não encontrado</p>
        )}{" "}
      </div>
    </div>
  );
};
