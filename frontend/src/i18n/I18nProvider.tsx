import { useMemo } from "react";
import { IntlProvider } from "react-intl";
import enMessages from "../i18n/profile/en.json";
import ptMessages from "../i18n/profile/pt.json";

type MessageFormat = Record<string, string>;

const messagesMap: Record<string, MessageFormat> = {
  en: enMessages,
  pt: ptMessages,
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = "pt";
  const messages = useMemo(() => messagesMap[locale], [locale]);

  return (
    <IntlProvider locale={locale} messages={messages} defaultLocale="en">
      {children}
    </IntlProvider>
  );
}
