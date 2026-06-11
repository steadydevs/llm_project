import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Trash2, Plus, Bookmark, Flame, AlertCircle } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

export const Wishlist = () => {
  const { wishlist, availableGames, addWishlistItem, removeWishlistItem } = useAppContext();
  const [newTitle, setNewTitle] = useState("");
  const [newPlatform, setNewPlatform] = useState("PS5");
  const [error, setError] = useState("");
  const intl = useIntl();

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newTitle.trim()) {
      setError(intl.formatMessage({ id: "wishlist.add.error.empty" }));
      return;
    }

    // Check if already in wishlist
    const exists = wishlist.some(
      (item) =>
        item.title.toLowerCase() === newTitle.trim().toLowerCase() &&
        item.platform === newPlatform
    );

    if (exists) {
      setError(intl.formatMessage({ id: "wishlist.add.error.exists" }));
      return;
    }

    addWishlistItem(newTitle.trim(), newPlatform);
    setNewTitle("");
  };

  // Helper to count how many copies of a wishlisted game are available nearby
  const getNearbyMatchesCount = (title: string, platform: string) => {
    return availableGames.filter(
      (game) =>
        game.title.toLowerCase().includes(title.toLowerCase()) &&
        game.platform === platform
    ).length;
  };

  // Platform styling helper
  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case "PS5":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PS4":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "Nintendo Switch":
        return "bg-red-100 text-red-800 border-red-200";
      case "Xbox Series X":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-6 pt-10 pb-24">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
          <FormattedMessage id="wishlist.title" />
        </h1>
        <p className="text-sm text-neutral-500 mt-1 font-normal">
          <FormattedMessage id="wishlist.subtitle" />
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: Add form */}
        <div className="md:col-span-1">
          <div className="card-base p-5 sticky top-6">
            <h2 className="font-bold text-neutral-800 mb-4 text-base flex items-center gap-2">
              <Bookmark className="size-5 text-primary" />
              <FormattedMessage id="wishlist.add.title" />
            </h2>

            <form onSubmit={handleAddItem} className="space-y-4">
              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-500 uppercase">
                  <FormattedMessage id="wishlist.add.name" />
                </label>
                <input
                  type="text"
                  placeholder="Ex: GTA VI, Elden Ring..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
              </div>

              {/* Platform Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-500 uppercase">
                  <FormattedMessage id="wishlist.add.platform" />
                </label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                >
                  <option value="PS5">PS5</option>
                  <option value="Nintendo Switch">Nintendo Switch</option>
                  <option value="Xbox Series X">Xbox Series X</option>
                  <option value="PS4">PS4</option>
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5"
              >
                <Plus className="size-4" />
                <FormattedMessage id="wishlist.add.action" />
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Wishlist display */}
        <div className="md:col-span-2">
          {wishlist.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
              <Bookmark className="size-12 mx-auto text-neutral-300 mb-3" />
              <h3 className="font-semibold text-neutral-700 text-lg">
                <FormattedMessage id="wishlist.empty.title" />
              </h3>
              <p className="text-sm text-neutral-400 mt-1 max-w-xs mx-auto">
                <FormattedMessage id="wishlist.empty.text" />
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlist.map((item) => {
                const matches = getNearbyMatchesCount(item.title, item.platform);
                return (
                  <div
                    key={item.id}
                    className="card-base p-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${getPlatformBadge(item.platform)}`}>
                          {item.platform}
                        </span>
                        <h3 className="font-bold text-neutral-800 text-sm">{item.title}</h3>
                      </div>

                      {/* Match Status Badge */}
                      {matches > 0 ? (
                        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-full w-fit font-medium">
                          <Flame className="size-3.5 text-orange-600 fill-orange-500 shrink-0" />
                          <span>
                            <FormattedMessage id="wishlist.item.matches" values={{ count: matches }} />
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-neutral-400 text-xs px-2.5 py-1 w-fit">
                          <span className="size-1.5 rounded-full bg-neutral-300" />
                          <span>
                            <FormattedMessage id="wishlist.item.noMatches" />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Delete Action Button */}
                    <button
                      onClick={() => removeWishlistItem(item.id)}
                      className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
