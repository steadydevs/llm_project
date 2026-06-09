import { CreateIntlFn, Formatters, IntlCache, IntlFormatters, MessageDescriptor, MessageDescriptor as MessageDescriptor$1, ResolvedIntlConfig as ResolvedIntlConfig$1, createIntlCache } from "@formatjs/intl";
import { FormatXMLElementFn, Options, PrimitiveType } from "intl-messageformat";
import * as React from "react";

//#region packages/react-intl/utils.d.ts
type DefaultIntlConfig = Pick<ResolvedIntlConfig, "fallbackOnEmptyString" | "formats" | "messages" | "timeZone" | "textComponent" | "defaultLocale" | "defaultFormats" | "onError">;
declare const DEFAULT_INTL_CONFIG$1: DefaultIntlConfig;
//#endregion
//#region packages/react-intl/types.d.ts
type IntlConfig = Omit<ResolvedIntlConfig, keyof typeof DEFAULT_INTL_CONFIG$1> & Partial<typeof DEFAULT_INTL_CONFIG$1>;
interface ResolvedIntlConfig extends ResolvedIntlConfig$1<React.ReactNode> {
  textComponent?: React.ComponentType | keyof React.JSX.IntrinsicElements;
  wrapRichTextChunksInFragment?: boolean;
}
interface IntlShape extends ResolvedIntlConfig, IntlFormatters<React.ReactNode> {
  formatMessage(this: void, descriptor: MessageDescriptor$1, values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>, opts?: Options): string;
  formatMessage(this: void, descriptor: MessageDescriptor$1, values?: Record<string, React.ReactNode | PrimitiveType | FormatXMLElementFn<string, React.ReactNode>>, opts?: Options): Array<React.ReactNode>;
  formatters: Formatters;
}
//#endregion
//#region packages/react-intl/components/createIntl.d.ts
/**
* Create intl object
* @param config intl config
* @param cache cache for formatter instances to prevent memory leak
*/
declare const createIntl: CreateIntlFn<React.ReactNode, IntlConfig, IntlShape>;
//#endregion
//#region packages/react-intl/server.d.ts
declare function defineMessages<K extends keyof any, T = MessageDescriptor$1, U extends Record<K, T> = Record<K, T>>(msgs: U): U;
declare function defineMessage<T extends MessageDescriptor$1>(msg: T): T;
//#endregion
export { type IntlCache, type IntlConfig, type IntlShape, type MessageDescriptor, type ResolvedIntlConfig, createIntl, createIntlCache, defineMessage, defineMessages };
//# sourceMappingURL=server.d.ts.map