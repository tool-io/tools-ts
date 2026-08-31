import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, locale } from "../batch-shared.js";
export type Input = Readonly<{ readonly localeTag: string }>;
export type Output = Readonly<{
  readonly gregorianDatePartOrder: string;
  readonly fixedUtcGregorianProbeDisplay: string;
}>;
const inputFields = [
  { id: "localeTag", label: "Locale tag", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const tag = locale(input.localeTag),
    formatter = new Intl.DateTimeFormat(tag, {
      timeZone: "UTC",
      calendar: "gregory",
      numberingSystem: "latn",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }),
    parts = formatter.formatToParts(new Date(Date.UTC(2001, 10, 22))),
    order = parts
      .filter((p) => ["year", "month", "day"].includes(p.type))
      .map((p) => (p.type === "year" ? "Y" : p.type === "month" ? "M" : "D"))
      .join("");
  if (order.length !== 3 || new Set(order).size !== 3)
    simpleError(
      "locale",
      "Host locale data must expose one each Gregorian date part.",
    );
  return {
    gregorianDatePartOrder: order,
    fixedUtcGregorianProbeDisplay: parts.map((p) => p.value).join(""),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { localeTag: "en-US" } satisfies Input;
export const exampleOutput = {
  gregorianDatePartOrder: "MDY",
  fixedUtcGregorianProbeDisplay: "11/22/2001",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/date-format-locale-order-lookup",
  title: "Date Format Locale Order Lookup",
  description:
    "Resolve runtime locale Gregorian numeric date-part order with fixed UTC/Latin-digit unambiguous probe, not the locale’s preferred calendar, actual date parsing or current-clock dependence.",
  inputs: inputFields,
  outputs: [
    {
      id: "gregorianDatePartOrder",
      label: "Gregorian date part order",
      kind: "string",
    },
    {
      id: "fixedUtcGregorianProbeDisplay",
      label: "Fixed utc gregorian probe display",
      kind: "string",
    },
  ],
  calculate: (value) => calculate({ localeTag: value.localeTag as string }),
});
export const run = tool.execute;
export default tool;
