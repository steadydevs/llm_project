import { ChevronRight } from "lucide-react";

interface ProfileMenuItemProps {
  icon: React.ElementType;
  label: string;
}

export const ProfileMenuItem = ({
  icon: Icon,
  label,
}: ProfileMenuItemProps) => (
  <div className="flex items-center justify-between py-4 border-b border-neutral-100 cursor-pointer hover:bg-neutral-50 transition-colors">
    <div className="flex items-center gap-4">
      <Icon className="size-6 text-neutral-900" />
      <span className="text-base text-neutral-900">{label}</span>
    </div>
    <ChevronRight className="size-5 text-neutral-400" />
  </div>
);

export default ProfileMenuItem;
