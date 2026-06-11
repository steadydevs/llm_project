import {
  Settings,
  HelpCircle,
  BookOpen,
  LogOut,
  ChevronRight,
  Gamepad2,
  Award,
  MapPin,
  Star,
  Database,
  ShieldCheck,
  X,
} from "lucide-react";

import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";

const ProfileMenuItem = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) => (
  <div onClick={onClick} className="profile-item px-2 flex items-center justify-between py-4 border-b border-neutral-100 cursor-pointer hover:bg-neutral-50 transition-colors">
    <div className="flex items-center gap-4">
      <Icon className="size-5 text-neutral-700" />
      <span className="text-sm font-semibold text-neutral-700">{label}</span>
    </div>
    <ChevronRight className="size-5 text-neutral-400" />
  </div>
);

export const Profile = () => {
  const { currentUser, locale, setLocale } = useAppContext();
  const intl = useIntl();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 pt-10 px-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-neutral-900 tracking-tight">
        <FormattedMessage id="profile.title" />
      </h1>

      {/* Profile Card */}
      <div className="card-base p-6 mb-6 flex flex-col items-center text-center relative overflow-hidden">
        {/* Decorative corner background */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
        
        <img
          src="https://github.com/shadcn.png"
          alt="Profile"
          className="size-20 rounded-full mb-4 border-4 border-white shadow-md"
        />
        
        <h2 className="text-xl font-extrabold text-neutral-800 leading-tight">{currentUser.name}</h2>
        <p className="text-xs font-bold text-primary bg-red-50 border border-red-100 px-3 py-1 rounded-full mt-1.5">
          <FormattedMessage id="profile.role" />
        </p>

        {/* Location & Reputation */}
        <div className="flex items-center gap-6 mt-4 w-full justify-center text-sm">
          <div className="flex items-center gap-1.5 text-neutral-600 font-medium">
            <MapPin className="size-4 text-primary shrink-0" />
            <span>
              <FormattedMessage id="profile.city" />
            </span>
          </div>
          <div className="w-px h-4 bg-neutral-200" />
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-700">{currentUser.reputation.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Gamified Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card-base p-4 flex flex-col items-center justify-center gap-1.5 bg-white">
          <Gamepad2 className="size-7 text-primary" />
          <span className="font-extrabold text-base text-neutral-800">
            <FormattedMessage id="profile.inventoryValue" />
          </span>
          <span className="text-[10px] text-neutral-400 uppercase font-semibold">
            <FormattedMessage id="profile.inventory" />
          </span>
        </div>
        <div className="card-base p-4 flex flex-col items-center justify-center gap-1.5 bg-white">
          <Award className="size-7 text-primary" />
          <span className="font-extrabold text-base text-neutral-800">
            <FormattedMessage id="profile.swapsValue" />
          </span>
          <span className="text-[10px] text-neutral-400 uppercase font-semibold">
            <FormattedMessage id="profile.swaps" />
          </span>
        </div>
      </div>

      {/* Action List */}
      <div className="card-base px-4 py-2 bg-white">
        <ProfileMenuItem
          icon={Database}
          label={intl.formatMessage({ id: "profile.menu.inventory" })}
        />
        <ProfileMenuItem
          icon={Settings}
          label={intl.formatMessage({ id: "profile.menu.settings" })}
          onClick={() => setShowSettings(true)}
        />
        <ProfileMenuItem
          icon={ShieldCheck}
          label={intl.formatMessage({ id: "profile.menu.privacy" })}
        />
        <div className="my-2 border-t border-neutral-100" />
        <ProfileMenuItem
          icon={HelpCircle}
          label={intl.formatMessage({ id: "profile.menu.help" })}
        />
        <ProfileMenuItem
          icon={BookOpen}
          label={intl.formatMessage({ id: "profile.menu.terms" })}
        />
        <ProfileMenuItem
          icon={LogOut}
          label={intl.formatMessage({ id: "profile.menu.logout" })}
        />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="font-bold text-neutral-800 text-lg">
                <FormattedMessage id="settings.title" />
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                  <FormattedMessage id="settings.language" />
                </label>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as "pt" | "en")}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-neutral-800"
                >
                  <option value="pt">Português (Brasil)</option>
                  <option value="en">English (US)</option>
                </select>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full mt-4 bg-primary hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm"
              >
                <FormattedMessage id="settings.close" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;


