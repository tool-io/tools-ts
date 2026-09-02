import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  unique,
  dateDay,
  dayDate,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly expiryMonth: number;
  readonly expiryYear: number;
  readonly asOfCivilDate: string;
  readonly observedCvvCharacterCount: number;
  readonly callerAllowedCvvCharacterCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly expiryMonthEndInclusive: string;
  readonly expiredAtCallerDate: boolean;
  readonly cvvLengthMatchesCallerPolicy: boolean;
}>;
const inputFields = [
  { id: "expiryMonth", label: "Expiry month", kind: "number" },
  { id: "expiryYear", label: "Expiry year", kind: "number" },
  { id: "asOfCivilDate", label: "As of civil date", kind: "string" },
  {
    id: "observedCvvCharacterCount",
    label: "Observed cvv character count",
    kind: "number",
  },
  {
    id: "callerAllowedCvvCharacterCounts",
    label: "Caller allowed cvv character counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.expiryMonth, "month", 1, 12);
  bounded(input.expiryYear, "year", 1900, 2199);
  bounded(input.observedCvvCharacterCount, "count", 0, 128);
  input.callerAllowedCvvCharacterCounts.forEach((v) =>
    bounded(v, "count", 1, 8),
  );
  unique(input.callerAllowedCvvCharacterCounts.map(String), "lengths");
  const end = Date.UTC(input.expiryYear, input.expiryMonth, 0) / 86400000;
  return {
    expiryMonthEndInclusive: dayDate(end),
    expiredAtCallerDate: dateDay(input.asOfCivilDate) > end,
    cvvLengthMatchesCallerPolicy:
      input.callerAllowedCvvCharacterCounts.includes(
        input.observedCvvCharacterCount,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  expiryMonth: 10,
  expiryYear: 2026,
  asOfCivilDate: "2026-10-07",
  observedCvvCharacterCount: 3,
  callerAllowedCvvCharacterCounts: [3, 4],
} satisfies Input;
export const exampleOutput = {
  expiryMonthEndInclusive: "2026-10-31",
  expiredAtCallerDate: false,
  cvvLengthMatchesCallerPolicy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/card-expiry-cvv-length-checker",
  title: "Card Expiry CVV Length Checker",
  description:
    "Audit card expiry through inclusive last civil month day and caller CVV length policy using COUNT only (no CVV collected); not issuer validity or authentication. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "expiryMonthEndInclusive",
      label: "Expiry month end inclusive",
      kind: "string",
    },
    {
      id: "expiredAtCallerDate",
      label: "Expired at caller date",
      kind: "boolean",
    },
    {
      id: "cvvLengthMatchesCallerPolicy",
      label: "Cvv length matches caller policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      expiryMonth: value.expiryMonth as number,
      expiryYear: value.expiryYear as number,
      asOfCivilDate: value.asOfCivilDate as string,
      observedCvvCharacterCount: value.observedCvvCharacterCount as number,
      callerAllowedCvvCharacterCounts:
        value.callerAllowedCvvCharacterCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
