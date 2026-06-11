import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Search, MapPin, Star, Gamepad2, X, CheckCircle } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

export const Explore = () => {
  const { availableGames, requestGame } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const intl = useIntl();
  
  // Modal State
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [requestType, setRequestType] = useState<"trade" | "rent">("trade");
  const [showSuccess, setShowSuccess] = useState(false);

  // Platforms for filters
  const platforms = ["All", "PS5", "Nintendo Switch", "Xbox Series X", "PS4"];

  // Filter games based on search and platform
  const filteredGames = availableGames.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === "All" || game.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const handleOpenRequest = (game: any) => {
    setSelectedGame(game);
    setShowSuccess(false);
  };

  const handleConfirmRequest = () => {
    if (!selectedGame) return;
    requestGame(selectedGame.id, requestType);
    setShowSuccess(true);
    setTimeout(() => {
      setSelectedGame(null);
      setShowSuccess(false);
    }, 2000);
  };

  // Helper to get platform-specific styles
  const getPlatformStyle = (platform: string) => {
    switch (platform) {
      case "PS5":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          gradient: "from-blue-600 to-indigo-900",
          badge: "bg-blue-600",
        };
      case "PS4":
        return {
          bg: "bg-sky-50 text-sky-700 border-sky-200",
          gradient: "from-sky-500 to-blue-700",
          badge: "bg-sky-500",
        };
      case "Nintendo Switch":
        return {
          bg: "bg-red-50 text-red-700 border-red-200",
          gradient: "from-red-500 to-orange-600",
          badge: "bg-red-500",
        };
      case "Xbox Series X":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          gradient: "from-emerald-600 to-teal-900",
          badge: "bg-emerald-600",
        };
      default:
        return {
          bg: "bg-neutral-50 text-neutral-700 border-neutral-200",
          gradient: "from-neutral-700 to-neutral-900",
          badge: "bg-neutral-700",
        };
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-6 pt-10 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
          <FormattedMessage id="explore.title" />
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          <FormattedMessage id="explore.subtitle" />
        </p>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 size-5" />
          <input
            type="text"
            placeholder={intl.formatMessage({ id: "explore.search" })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-neutral-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-neutral-900 shadow-sm"
          />
        </div>

        {/* Platform Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {platforms.map((plat) => (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedPlatform === plat
                  ? "bg-primary border-primary text-white shadow-sm shadow-primary/25"
                  : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {plat === "All" ? intl.formatMessage({ id: "explore.allConsoles" }) : plat}
            </button>
          ))}
        </div>
      </div>

      {/* Game Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredGames.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
            <Gamepad2 className="size-12 mx-auto text-neutral-300 mb-3" />
            <h3 className="font-semibold text-neutral-700 text-lg">
              <FormattedMessage id="explore.empty.title" />
            </h3>
            <p className="text-sm text-neutral-400 mt-1 max-w-sm mx-auto">
              <FormattedMessage id="explore.empty.text" />
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => {
              const theme = getPlatformStyle(game.platform);
              return (
                <div key={game.id} className="card-base group flex flex-col overflow-hidden hover:shadow-lg hover:-translate-y-0.5">
                  {/* Visual Game Art Header */}
                  <div className="h-44 bg-neutral-200 relative overflow-hidden flex items-center justify-center">
                    {game.image ? (
                      <img
                        src={game.image}
                        alt={game.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center p-4`}>
                        <Gamepad2 className="size-12 text-white/20 absolute right-4 bottom-4" />
                        <span className="text-white font-extrabold text-lg text-center tracking-tight leading-snug drop-shadow-md">
                          {game.title}
                        </span>
                      </div>
                    )}
                    <span className={`absolute top-3 right-3 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded ${theme.badge} shadow-sm z-10`}>
                      {game.platform}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Owner Details */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-neutral-400">
                            <FormattedMessage id="explore.card.owner" />
                          </span>
                          <span className="text-sm font-semibold text-neutral-800">{game.owner}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                          <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold text-yellow-700">{game.reputation.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Distance & Condition Info */}
                      <div className="grid grid-cols-2 gap-4 py-3 border-y border-neutral-100 mb-5 text-sm">
                        <div className="flex items-center gap-2 text-neutral-600">
                          <MapPin className="size-4 text-primary shrink-0" />
                          <span className="font-medium">{game.distance} km</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                            <FormattedMessage id="explore.card.condition" />
                          </span>
                          <span className="font-semibold text-neutral-700">{game.condition}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleOpenRequest(game)}
                      className="w-full bg-primary hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow active:scale-[0.98]"
                    >
                      <FormattedMessage id="explore.card.action" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {selectedGame && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {showSuccess ? (
              <div className="p-8 text-center flex flex-col items-center">
                <CheckCircle className="size-16 text-green-500 animate-bounce mb-4" />
                <h3 className="text-xl font-bold text-neutral-900">
                  <FormattedMessage id="explore.modal.success.title" />
                </h3>
                <p className="text-sm text-neutral-500 mt-2 max-w-xs">
                  <FormattedMessage
                    id="explore.modal.success.text"
                    values={{ title: <strong>{selectedGame.title}</strong> }}
                  />
                </p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className={`p-6 bg-gradient-to-r ${getPlatformStyle(selectedGame.platform).gradient} text-white flex justify-between items-start`}>
                  <div>
                    <span className="text-[10px] bg-white/20 uppercase font-extrabold px-2 py-0.5 rounded">
                      {selectedGame.platform}
                    </span>
                    <h3 className="text-xl font-extrabold mt-2 leading-tight">{selectedGame.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5">
                  {/* Select Request Type */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                      <FormattedMessage id="explore.modal.type.label" />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRequestType("trade")}
                        className={`p-3 rounded-xl border text-center font-bold text-sm transition-all ${
                          requestType === "trade"
                            ? "border-primary bg-red-50 text-primary"
                            : "border-neutral-200 hover:bg-neutral-50 text-neutral-600"
                        }`}
                      >
                        <FormattedMessage id="explore.modal.type.trade" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequestType("rent")}
                        className={`p-3 rounded-xl border text-center font-bold text-sm transition-all ${
                          requestType === "rent"
                            ? "border-primary bg-red-50 text-primary"
                            : "border-neutral-200 hover:bg-neutral-50 text-neutral-600"
                        }`}
                      >
                        <FormattedMessage id="explore.modal.type.rent" />
                      </button>
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="bg-neutral-50 p-4 rounded-xl space-y-2.5 text-sm text-neutral-600">
                    <div className="flex justify-between">
                      <span>
                        <FormattedMessage id="explore.modal.owner" />
                      </span>
                      <span className="font-semibold text-neutral-800">{selectedGame.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <FormattedMessage id="explore.modal.rating" />
                      </span>
                      <span className="font-semibold text-neutral-800 flex items-center gap-1">
                        ⭐ {selectedGame.reputation.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <FormattedMessage id="explore.modal.distance" />
                      </span>
                      <span className="font-semibold text-neutral-800">{selectedGame.distance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <FormattedMessage id="explore.modal.condition" />
                      </span>
                      <span className="font-semibold text-neutral-800">{selectedGame.condition}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 text-center">
                    <FormattedMessage id="explore.modal.footnote" />
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedGame(null)}
                      className="flex-1 py-3 border border-neutral-200 text-neutral-600 font-semibold rounded-xl text-sm hover:bg-neutral-50"
                    >
                      <FormattedMessage id="explore.modal.cancel" />
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmRequest}
                      className="flex-1 py-3 bg-primary hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm shadow-primary/20"
                    >
                      <FormattedMessage id="explore.modal.confirm" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;

