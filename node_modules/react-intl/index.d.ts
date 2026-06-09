import * as React from "react";
import { CreateIntlFn, CustomFormatConfig, CustomFormatConfig as CustomFormatConfig$1, CustomFormats, FormatDateOptions, FormatDateOptions as FormatDateOptions$1, FormatDateTimeRangeOptions, FormatDisplayNameOptions, FormatDisplayNameOptions as FormatDisplayNameOptions$1, FormatListOptions, FormatListOptions as FormatListOptions$1, FormatNumberOptions, FormatNumberOptions as FormatNumberOptions$1, FormatPluralOptions, FormatPluralOptions as FormatPluralOptions$1, FormatRelativeTimeOptions, FormatRelativeTimeOptions as FormatRelativeTimeOptions$1, FormatTimeOptions, Formatters, Formatters as Formatters$1, IntlCache, IntlError as ReactIntlError, IntlErrorCode as ReactIntlErrorCode, IntlFormatters, IntlFormatters as IntlFormatters$1, InvalidConfigError, MessageDescriptor, MessageDescriptor as MessageDescriptor$1, MessageFormatError, MissingDataError, MissingTranslationError, ResolvedIntlConfig as ResolvedIntlConfig$1, UnsupportedFormatterError, createIntlCache } from "@formatjs/intl";
import { FormatXMLElementFn, Options, PrimitiveType, PrimitiveType as PrimitiveType$1 } from "intl-messageformat";
import { MessageFormatElement } from "@formatjs/icu-messageformat-parser";

//#region packages/ecma402-abstract/types/number.d.ts
type NumberFormatNotation = "standard" | "scientific" | "engineering" | "compact";
type RoundingPriorityType = "auto" | "morePrecision" | "lessPrecision";
type RoundingModeType = "ceil" | "floor" | "expand" | "trunc" | "halfCeil" | "halfFloor" | "halfExpand" | "halfTrunc" | "halfEven";
type UseGroupingType = "min2" | "auto" | "always" | boolean;
interface NumberFormatDigitOptions {
  minimumIntegerDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  roundingPriority?: RoundingPriorityType;
  roundingIncrement?: number;
  roundingMode?: RoundingModeType;
  trailingZeroDisplay?: TrailingZeroDisplay;
}
type NumberFormatOptionsLocaleMatcher = "lookup" | "best fit";
type NumberFormatOptionsStyle = "decimal" | "percent" | "currency" | "unit";
type NumberFormatOptionsCompactDisplay = "short" | "long";
type NumberFormatOptionsCurrencyDisplay = "symbol" | "code" | "name" | "narrowSymbol";
type NumberFormatOptionsCurrencySign = "standard" | "accounting";
type NumberFormatOptionsNotation = NumberFormatNotation;
type NumberFormatOptionsSignDisplay = "auto" | "always" | "never" | "exceptZero" | "negative";
type NumberFormatOptionsUnitDisplay = "long" | "short" | "narrow";
type TrailingZeroDisplay = "auto" | "stripIfInteger";
type NumberFormatOptions = Omit<Intl.NumberFormatOptions, "signDisplay" | "useGrouping"> & NumberFormatDigitOptions & {
  localeMatcher?: NumberFormatOptionsLocaleMatcher;
  style?: NumberFormatOptionsStyle;
  compactDisplay?: NumberFormatOptionsCompactDisplay;
  currencyDisplay?: NumberFormatOptionsCurrencyDisplay;
  currencySign?: NumberFormatOptionsCurrencySign;
  notation?: NumberFormatOptionsNotation;
  signDisplay?: NumberFormatOptionsSignDisplay;
  unit?: string;
  unitDisplay?: NumberFormatOptionsUnitDisplay;
  numberingSystem?: string;
  trailingZeroDisplay?: TrailingZeroDisplay;
  roundingPriority?: RoundingPriorityType;
  roundingIncrement?: number;
  roundingMode?: RoundingModeType;
  useGrouping?: UseGroupingType;
};
//#endregion
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
interface IntlShape extends ResolvedIntlConfig, IntlFormatters$1<React.ReactNode> {
  formatMessage(this: void, descriptor: MessageDescriptor$1, values?: Record<string, PrimitiveType$1 | FormatXMLElementFn<string, string>>, opts?: Options): string;
  formatMessage(this: void, descriptor: MessageDescriptor$1, values?: Record<string, React.ReactNode | PrimitiveType$1 | FormatXMLElementFn<string, React.ReactNode>>, opts?: Options): Array<React.ReactNode>;
  formatters: Formatters$1;
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
//#region packages/react-intl/components/context.d.ts
declare const IntlContext: React.Context<IntlShape>;
declare const Provider: React.Provider<IntlShape>;
//#endregion
//#region packages/react-intl/components/dateTimeRange.d.ts
interface Props$3 extends FormatDateTimeRangeOptions {
  from: Parameters<Intl.DateTimeFormat["formatRange"]>[0];
  to: Parameters<Intl.DateTimeFormat["formatRange"]>[1];
  children?(value: React.ReactNode): React.ReactElement | null;
}
declare const FormattedDateTimeRange: React.FC<Props$3>;
//#endregion
//#region packages/react-intl/components/message.d.ts
interface Props$2<V extends Record<string, any> = Record<string, React.ReactNode | PrimitiveType$1 | FormatXMLElementFn<React.ReactNode>>> extends MessageDescriptor$1 {
  values?: V;
  tagName?: React.ElementType<any>;
  children?(nodes: React.ReactNode[]): React.ReactNode | null;
  ignoreTag?: Options["ignoreTag"];
}
declare const MemoizedFormattedMessage: React.ComponentType<Props$2>;
//#endregion
//#region packages/react-intl/components/plural.d.ts
interface Props$1 extends FormatPluralOptions$1 {
  value: number;
  other: React.ReactNode;
  zero?: React.ReactNode;
  one?: React.ReactNode;
  two?: React.ReactNode;
  few?: React.ReactNode;
  many?: React.ReactNode;
  children?(value: React.ReactNode): React.ReactElement | null;
}
declare const FormattedPlural: React.FC<Props$1>;
//#endregion
//#region packages/react-intl/components/provider.d.ts
declare const IntlProvider: React.FC<React.PropsWithChildren<IntlConfig>>;
//#endregion
//#region packages/react-intl/components/relative.d.ts
interface Props extends FormatRelativeTimeOptions$1 {
  value?: number;
  unit?: Intl.RelativeTimeFormatUnit;
  updateIntervalInSeconds?: number;
  children?(value: string): React.ReactElement | null;
}
declare const FormattedRelativeTime: React.FC<Props>;
//#endregion
//#region packages/react-intl/components/useIntl.d.ts
declare function useIntl(this: void): IntlShape;
//#endregion
//#region packages/react-intl/components/createFormattedComponent.d.ts
type Formatter = {
  formatDate: FormatDateOptions$1;
  formatTime: FormatDateOptions$1;
  formatNumber: FormatNumberOptions$1;
  formatList: FormatListOptions$1;
  formatDisplayName: FormatDisplayNameOptions$1;
};
declare const FormattedNumberParts: React.FC<Formatter["formatNumber"] & {
  value: Parameters<IntlShape["formatNumber"]>[0];
  children(val: Intl.NumberFormatPart[]): React.ReactElement | null;
}>;
declare const FormattedListParts: React.FC<Formatter["formatList"] & {
  value: Parameters<IntlShape["formatList"]>[0];
  children(val: ReturnType<Intl.ListFormat["formatToParts"]>): React.ReactElement | null;
}>;
//#endregion
//#region packages/react-intl/index.d.ts
declare function defineMessages<K extends keyof any, T = MessageDescriptor$1, U extends Record<K, T> = Record<K, T>>(msgs: U): U;
declare function defineMessage<T extends MessageDescriptor$1>(msg: T): T;
declare const FormattedDate: React.FC<Intl.DateTimeFormatOptions & CustomFormatConfig$1<"date"> & {
  value: string | number | Date | undefined;
  children?(formattedDate: string): React.ReactElement | null;
}>;
declare const FormattedTime: React.FC<Intl.DateTimeFormatOptions & CustomFormatConfig$1<"time"> & {
  value: string | number | Date | undefined;
  children?(formattedTime: string): React.ReactElement | null;
}>;
declare const FormattedNumber: React.FC<Omit<NumberFormatOptions, "localeMatcher"> & CustomFormatConfig$1<"number"> & {
  value: Parameters<IntlShape["formatNumber"]>[0];
  children?(formattedNumber: string): React.ReactElement | null;
}>;
declare const FormattedList: React.FC<Intl.ListFormatOptions & {
  value: readonly React.ReactNode[];
}>;
declare const FormattedDisplayName: React.FC<Intl.DisplayNamesOptions & {
  value: string;
}>;
declare const FormattedDateParts: React.FC<FormatDateOptions$1 & {
  value: Parameters<Intl.DateTimeFormat["format"]>[0] | string;
  children(val: Intl.DateTimeFormatPart[]): React.ReactElement | null;
}>;
declare const FormattedTimeParts: React.FC<FormatTimeOptions & {
  value: Parameters<Intl.DateTimeFormat["format"]>[0] | string;
  children(val: Intl.DateTimeFormatPart[]): React.ReactElement | null;
}>;
//#endregion
export { type CustomFormatConfig, type CustomFormats, type FormatDateOptions, type FormatDisplayNameOptions, type FormatListOptions, type FormatNumberOptions, type FormatPluralOptions, type FormatRelativeTimeOptions, FormattedDate, FormattedDateParts, FormattedDateTimeRange, FormattedDisplayName, FormattedList, FormattedListParts, MemoizedFormattedMessage as FormattedMessage, FormattedNumber, FormattedNumberParts, FormattedPlural, FormattedRelativeTime, FormattedTime, FormattedTimeParts, type Formatters, type IntlCache, type IntlConfig, IntlContext, type IntlFormatters, IntlProvider, type IntlShape, InvalidConfigError, type MessageDescriptor, type MessageFormatElement, MessageFormatError, MissingDataError, MissingTranslationError, type PrimitiveType, Provider as RawIntlProvider, ReactIntlError, ReactIntlErrorCode, type ResolvedIntlConfig, UnsupportedFormatterError, createIntl, createIntlCache, defineMessage, defineMessages, useIntl };
//# sourceMappingURL=index.d.ts.map