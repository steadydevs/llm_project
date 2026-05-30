import {
  Settings,
  HelpCircle,
  User,
  Shield,
  Users,
  HandHelping,
  Gift,
  BookOpen,
  LogOut,
  ChevronRight,
} from "lucide-react";

import React from "react";

const ProfileMenuItem = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="profile-item">
    <div className="flex items-center gap-4">
      <Icon className="size-6 text-neutral-900" />
      <span className="text-base text-neutral-900">{label}</span>
    </div>
    <ChevronRight className="size-5 text-neutral-400" />
  </div>
);

export const Profile = () => {
  return (
    // Container principal ocupando a tela toda, com padding para o conteúdo
    <div className="min-h-screen bg-neutral-100 pb-24 pt-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-neutral-900">Profile</h1>

      <div className="card-base p-6 mb-8 flex flex-col items-center text-center">
        <img
          src="https://github.com/shadcn.png"
          alt="Profile"
          className="size-24 rounded-full mb-4 border-2 border-primary"
        />
        <h2 className="text-xl font-bold">Diogo</h2>
        <p className="text-neutral-700">Guest</p>
      </div>

      {/* Grid de Atalhos (Past trips / Connections) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card-base p-4 flex flex-col items-center justify-center gap-2">
          <BookOpen className="size-8 text-primary" />
          <span className="font-semibold text-sm">Past trips</span>
        </div>
        <div className="card-base p-4 flex flex-col items-center justify-center gap-2">
          <Users className="size-8 text-primary" />
          <span className="font-semibold text-sm">Connections</span>
        </div>
      </div>

      {/* Lista de Ações (usando o componente ProfileMenuItem) */}
      <div className="card-base px-4 py-2">
        <ProfileMenuItem icon={Settings} label="Account settings" />
        <ProfileMenuItem icon={HelpCircle} label="Get help" />
        <ProfileMenuItem icon={User} label="View profile" />
        <ProfileMenuItem icon={Shield} label="Privacy" />
        <div className="my-2 border-t border-neutral-100" />
        <ProfileMenuItem icon={Users} label="Refer a host" />
        <ProfileMenuItem icon={HandHelping} label="Find a co-host" />
        <ProfileMenuItem icon={Gift} label="Gift cards" />
        <ProfileMenuItem icon={BookOpen} label="Legal" />
        <ProfileMenuItem icon={LogOut} label="Log out" />
      </div>
    </div>
  );
};

export default Profile;
