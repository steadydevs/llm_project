import { Navbar } from "./components/Ui/Navbar";
import { Profile } from "./components/Pages/Profile";
import { useState } from "react";
import { Explore } from "./components/Pages/Explore";
import { Deals } from "./components/Pages/Deals";
import { Wishlist } from "./components/Pages/WishList";
import { Messages } from "./components/Pages/Messages/Messages";

function App() {
  const [currentPage, setCurrentPage] = useState("Messages");

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col pb-20">
      <main className="flex-1 overflow-y-auto">
        {currentPage === "Explore" && <Explore />}
        {currentPage === "Wishlist" && <Wishlist />}
        {currentPage === "Deals" && <Deals />}
        {currentPage === "Messages" && <Messages />}
        {currentPage === "Profile" && <Profile />}
      </main>
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;


