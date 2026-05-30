import { Navbar } from "./components/Navbar";
import { Profile } from "./components/Profile";
import { useState } from "react";
import { Explore } from "./components/Explore";
import { Deals } from "./components/Deals";
import { Wishlist } from "./components/WishList";
import { Messages } from "./components/Messages";

function App() {
  const [currentPage, setCurrentPage] = useState("Messages");

  return (
    <div className="min-h-screen bg-white">
      <main>
        {currentPage === "Explore" && <Explore />}
        {currentPage === "Wishlist" && <Wishlist />}
        {currentPage === "Deals" && <Deals />}
        {currentPage === "Messages" && <Messages />}
        {currentPage === "Profile" && <Profile />}

        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      </main>
    </div>
  );
}

export default App;
