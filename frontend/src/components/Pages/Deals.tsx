import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import type { Deal } from "../../context/AppContext";
import { Handshake, Calendar, MapPin, CheckCircle, AlertTriangle, MessageSquare, ArrowRight } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

export const Deals = () => {
  const { deals, updateDealStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState<"requests" | "ongoing" | "history">("requests");
  const intl = useIntl();

  // Filter deals based on status tabs
  const filteredDeals = deals.filter((deal) => {
    if (activeTab === "requests") {
      return deal.status === "solicitado" || deal.status === "aceito_pelo_dono";
    }
    if (activeTab === "ongoing") {
      return deal.status === "em_andamento" || deal.status === "disputa";
    }
    if (activeTab === "history") {
      return deal.status === "devolvido";
    }
    return false;
  });

  // Get status color and label
  const getStatusMeta = (status: Deal["status"]) => {
    switch (status) {
      case "solicitado":
        return {
          label: intl.formatMessage({ id: "deals.status.solicitado" }),
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          icon: <AlertTriangle className="size-4 text-amber-600 shrink-0" />,
        };
      case "aceito_pelo_dono":
        return {
          label: intl.formatMessage({ id: "deals.status.aceito" }),
          bg: "bg-indigo-50 text-indigo-800 border-indigo-200",
          icon: <CheckCircle className="size-4 text-indigo-600 shrink-0" />,
        };
      case "em_andamento":
        return {
          label: intl.formatMessage({ id: "deals.status.ongoing" }),
          bg: "bg-green-50 text-green-800 border-green-200",
          icon: <Handshake className="size-4 text-green-600 shrink-0" />,
        };
      case "devolvido":
        return {
          label: intl.formatMessage({ id: "deals.status.done" }),
          bg: "bg-neutral-100 text-neutral-600 border-neutral-200",
          icon: <CheckCircle className="size-4 text-neutral-500 shrink-0" />,
        };
      case "disputa":
        return {
          label: intl.formatMessage({ id: "deals.status.dispute" }),
          bg: "bg-red-50 text-red-800 border-red-200",
          icon: <AlertTriangle className="size-4 text-red-600 shrink-0" />,
        };
    }
  };

  // Get type badge
  const getTypeBadge = (type: Deal["type"]) => {
    return type === "trade"
      ? "bg-purple-100 text-purple-800 border-purple-200"
      : "bg-teal-100 text-teal-800 border-teal-200";
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-6 pt-10 pb-24">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight font-sans">
          <FormattedMessage id="deals.title" />
        </h1>
        <p className="text-sm text-neutral-500 mt-1 font-normal">
          <FormattedMessage id="deals.subtitle" />
        </p>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex border-b border-neutral-200 bg-white p-1.5 rounded-2xl border">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all ${
              activeTab === "requests"
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <FormattedMessage
              id="deals.tab.requests"
              values={{ count: deals.filter(d => d.status === "solicitado" || d.status === "aceito_pelo_dono").length }}
            />
          </button>
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all ${
              activeTab === "ongoing"
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <FormattedMessage
              id="deals.tab.ongoing"
              values={{ count: deals.filter(d => d.status === "em_andamento" || d.status === "disputa").length }}
            />
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all ${
              activeTab === "history"
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <FormattedMessage
              id="deals.tab.history"
              values={{ count: deals.filter(d => d.status === "devolvido").length }}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
            <Handshake className="size-12 mx-auto text-neutral-300 mb-3" />
            <h3 className="font-semibold text-neutral-700 text-lg">
              <FormattedMessage id="deals.empty.title" />
            </h3>
            <p className="text-sm text-neutral-400 mt-1 max-w-xs mx-auto">
              {activeTab === "requests" && intl.formatMessage({ id: "deals.empty.requests" })}
              {activeTab === "ongoing" && intl.formatMessage({ id: "deals.empty.ongoing" })}
              {activeTab === "history" && intl.formatMessage({ id: "deals.empty.history" })}
            </p>
          </div>
        ) : (
          filteredDeals.map((deal) => {
            const meta = getStatusMeta(deal.status);
            return (
              <div
                key={deal.id}
                className="card-base p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4 items-center flex-1">
                  {/* Game cover thumbnail */}
                  {deal.image && (
                    <img
                      src={deal.image}
                      alt={deal.gameTitle}
                      referrerPolicy="no-referrer"
                      className="w-16 h-20 rounded-xl object-cover shrink-0 border border-neutral-200 shadow-sm"
                    />
                  )}
                  {/* Left Side: Game details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded border bg-neutral-100 text-neutral-800 uppercase">
                        {deal.platform}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${getTypeBadge(deal.type)}`}>
                        {deal.type === "trade"
                          ? intl.formatMessage({ id: "deals.type.trade" })
                          : intl.formatMessage({ id: "deals.type.rent" })}
                      </span>
                      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${meta.bg}`}>
                        {meta.icon}
                        <span>{meta.label}</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-neutral-800 text-lg leading-tight">{deal.gameTitle}</h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 font-medium">
                      <div className="flex items-center gap-1">
                        <span className="text-neutral-400">
                          <FormattedMessage id="explore.card.owner" />:
                        </span>
                        <span className="font-semibold text-neutral-700">{deal.owner}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-primary" />
                        <span>{deal.distance} km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3.5 text-neutral-400" />
                        <span>{deal.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Interactive state transitions */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 md:w-56 justify-center">
                  {deal.status === "solicitado" && (
                    <button
                      onClick={() => updateDealStatus(deal.id, "aceito_pelo_dono")}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      <FormattedMessage id="deals.action.approve" />
                      <ArrowRight className="size-3" />
                    </button>
                  )}

                  {deal.status === "aceito_pelo_dono" && (
                    <button
                      onClick={() => updateDealStatus(deal.id, "em_andamento")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      <FormattedMessage id="deals.action.collect" />
                      <ArrowRight className="size-3" />
                    </button>
                  )}

                  {deal.status === "em_andamento" && (
                    <>
                      <button
                        onClick={() => updateDealStatus(deal.id, "devolvido")}
                        className="w-full bg-neutral-800 hover:bg-neutral-900 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                      >
                        <FormattedMessage id="deals.action.return" />
                      </button>
                      <button
                        onClick={() => updateDealStatus(deal.id, "disputa")}
                        className="w-full border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-2 rounded-xl text-xs transition-colors"
                      >
                        <FormattedMessage id="deals.action.dispute" />
                      </button>
                    </>
                  )}

                  {deal.status === "disputa" && (
                    <button
                      onClick={() => updateDealStatus(deal.id, "em_andamento")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                    >
                      <FormattedMessage id="deals.action.resolve" />
                    </button>
                  )}

                  {deal.status !== "devolvido" && (
                    <button className="w-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 font-semibold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1">
                      <MessageSquare className="size-3 text-neutral-400" />
                      <FormattedMessage id="deals.action.chat" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Deals;
