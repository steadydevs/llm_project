import { Gamepad2, Heart, MessageSquare, Search, User } from "lucide-react";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar = ({ currentPage, onNavigate }: NavbarProps) => {
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
            const isActive = currentPage === item.name;
            return (
              <li
                key={item.name}
                onClick={() => onNavigate(item.name)}
                className={`flex flex-col items-center justify-center text-xs font-medium cursor-pointer transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
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
