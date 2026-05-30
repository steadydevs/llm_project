import { useState } from "react";
import { Search, Settings } from "lucide-react";
import { FilterButton } from "./FilterButton";
import { DealsChatMessage } from "./DealsChatMessage.tsx";
import { Chatbot } from "./Chatbot2.tsx";

const MESSAGE_COMPONENTS: Record<string, React.FC> = {
  Deals: DealsChatMessage,
  Chatbot: Chatbot,
};

export const Messages = () => {
  const [activeFilter, setActiveFilter] = useState("Chatbot");
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
        {["Deals", "Chatbot"].map((filter) => (
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
