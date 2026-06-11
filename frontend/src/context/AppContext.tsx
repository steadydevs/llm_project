import React, { createContext, useContext, useState, useEffect } from "react";

export interface AvailableGame {
  id: string;
  title: string;
  platform: "PS5" | "Nintendo Switch" | "Xbox Series X" | "PS4";
  condition: "Perfeito" | "Como Novo" | "Bom" | "Marcas de Uso";
  owner: string;
  reputation: number;
  distance: number; // in km
  image?: string;
}

export interface WishlistItem {
  id: string;
  title: string;
  platform: string;
}

export interface Deal {
  id: string;
  gameTitle: string;
  platform: string;
  owner: string;
  borrower: string;
  type: "trade" | "rent";
  status: "solicitado" | "aceito_pelo_dono" | "em_andamento" | "devolvido" | "disputa";
  distance: number;
  date: string;
  image?: string;
}

interface AppContextType {
  availableGames: AvailableGame[];
  wishlist: WishlistItem[];
  deals: Deal[];
  currentUser: {
    name: string;
    role: string;
    city: string;
    reputation: number;
  };
  locale: "pt" | "en";
  setLocale: (locale: "pt" | "en") => void;
  requestGame: (gameId: string, type: "trade" | "rent") => void;
  updateDealStatus: (dealId: string, nextStatus: Deal["status"]) => void;
  addWishlistItem: (title: string, platform: string) => void;
  removeWishlistItem: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_AVAILABLE_GAMES: AvailableGame[] = [
  {
    id: "g1",
    title: "Elden Ring",
    platform: "PS5",
    condition: "Perfeito",
    owner: "Vitor Amadeu",
    reputation: 4.9,
    distance: 1.5,
  },
  {
    id: "g2",
    title: "The Legend of Zelda: Tears of the Kingdom",
    platform: "Nintendo Switch",
    condition: "Como Novo",
    owner: "Stephanie Pinho",
    reputation: 5.0,
    distance: 3.2,
  },
  {
    id: "g3",
    title: "Resident Evil 4 Remake",
    platform: "PS5",
    condition: "Bom",
    owner: "Gustavo Santos",
    reputation: 4.7,
    distance: 0.8,
  },
  {
    id: "g4",
    title: "Super Mario Odyssey",
    platform: "Nintendo Switch",
    condition: "Bom",
    owner: "Pedro Henrique",
    reputation: 4.2,
    distance: 7.4,
  },
  {
    id: "g5",
    title: "Red Dead Redemption II",
    platform: "Xbox Series X",
    condition: "Marcas de Uso",
    owner: "Carlos Souza",
    reputation: 4.5,
    distance: 5.1,
  },
  {
    id: "g6",
    title: "Hades",
    platform: "Nintendo Switch",
    condition: "Perfeito",
    owner: "Stephanie Pinho",
    reputation: 5.0,
    distance: 3.2,
  },
  {
    id: "g7",
    title: "Marvel's Spider-Man 2",
    platform: "PS5",
    condition: "Como Novo",
    owner: "Arthur Lima",
    reputation: 4.8,
    distance: 2.1,
  }
];

const INITIAL_WISHLIST: WishlistItem[] = [
  { id: "w1", title: "Marvel's Spider-Man 2", platform: "PS5" },
  { id: "w2", title: "Hollow Knight", platform: "Nintendo Switch" },
];

const INITIAL_DEALS: Deal[] = [
  {
    id: "d1",
    gameTitle: "Resident Evil 4 Remake",
    platform: "PS5",
    owner: "Gustavo Santos",
    borrower: "Diogo",
    type: "rent",
    status: "solicitado",
    distance: 0.8,
    date: "10 Jun 2026",
  },
  {
    id: "d2",
    gameTitle: "The Legend of Zelda: Tears of the Kingdom",
    platform: "Nintendo Switch",
    owner: "Stephanie Pinho",
    borrower: "Diogo",
    type: "trade",
    status: "em_andamento",
    distance: 3.2,
    date: "08 Jun 2026",
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableGames, setAvailableGames] = useState<AvailableGame[]>(INITIAL_AVAILABLE_GAMES);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [locale, setLocale] = useState<"pt" | "en">("pt");

  const currentUser = {
    name: "Diogo",
    role: "Membro Premium",
    city: "Lages, SC",
    reputation: 4.8,
  };

  // Dynamic fetch of covers from RAWG API
  useEffect(() => {
    const fetchCovers = async () => {
      try {
        const updatedGames = await Promise.all(
          availableGames.map(async (game) => {
            if (game.image) return game;
            try {
              const res = await fetch(
                `https://api.rawg.io/api/games?search=${encodeURIComponent(game.title)}&key=fc1fb4f8fb85440b8c27fd1092ef64cb&page_size=1`
              );
              if (res.ok) {
                const data = await res.json();
                const imageUrl = data.results?.[0]?.background_image;
                if (imageUrl) {
                  return { ...game, image: imageUrl };
                }
              }
            } catch (e) {
              console.error(`Erro ao carregar imagem para ${game.title}:`, e);
            }
            return game;
          })
        );
        setAvailableGames(updatedGames);

        const updatedDeals = await Promise.all(
          deals.map(async (deal) => {
            if (deal.image) return deal;
            try {
              const res = await fetch(
                `https://api.rawg.io/api/games?search=${encodeURIComponent(deal.gameTitle)}&key=fc1fb4f8fb85440b8c27fd1092ef64cb&page_size=1`
              );
              if (res.ok) {
                const data = await res.json();
                const imageUrl = data.results?.[0]?.background_image;
                if (imageUrl) {
                  return { ...deal, image: imageUrl };
                }
              }
            } catch (e) {
              console.error(`Erro ao carregar imagem para deal ${deal.gameTitle}:`, e);
            }
            return deal;
          })
        );
        setDeals(updatedDeals);
      } catch (err) {
        console.error("Erro geral ao carregar imagens do RAWG:", err);
      }
    };

    fetchCovers();
  }, []);

  const requestGame = (gameId: string, type: "trade" | "rent") => {
    const game = availableGames.find((g) => g.id === gameId);
    if (!game) return;

    // Create new deal
    const newDeal: Deal = {
      id: "d_" + Date.now(),
      gameTitle: game.title,
      platform: game.platform,
      owner: game.owner,
      borrower: currentUser.name,
      type,
      status: "solicitado",
      distance: game.distance,
      image: game.image,
      date: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    setDeals((prev) => [newDeal, ...prev]);

    // Remove from available list for this local user session
    setAvailableGames((prev) => prev.filter((g) => g.id !== gameId));
  };

  const updateDealStatus = (dealId: string, nextStatus: Deal["status"]) => {
    setDeals((prev) =>
      prev.map((deal) => (deal.id === dealId ? { ...deal, status: nextStatus } : deal))
    );
  };

  const addWishlistItem = (title: string, platform: string) => {
    const newItem: WishlistItem = {
      id: "w_" + Date.now(),
      title,
      platform,
    };
    setWishlist((prev) => [...prev, newItem]);
  };

  const removeWishlistItem = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        availableGames,
        wishlist,
        deals,
        currentUser,
        locale,
        setLocale,
        requestGame,
        updateDealStatus,
        addWishlistItem,
        removeWishlistItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
