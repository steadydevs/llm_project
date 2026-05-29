import { Gamepad2, Heart, MessageSquare, Search, User } from "lucide-react";

export const Navbar = () => {
  const navItems = [
    { name: "Explore", icon: Search },
    { name: "Wishlist", icon: Heart },
    { name: "Deals", icon: Gamepad2 },
    { name: "Messages", icon: MessageSquare },
    { name: "Profile", icon: User },
  ];

  return (
    <div className="w-full fixed bottom-0 left-0 z-50">
      <nav className="h-18 flex items-center justify-center px-4 bg-white shadow-nav">
        <ul className="flex w-full flex-row items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.name}
                className="flex flex-col items-center justify-center text-xs font-medium text-neutral-700 hover:text-nintendo-red tensition cursor-pointer"
              >
                <Icon size={22} />
                {item.name}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
