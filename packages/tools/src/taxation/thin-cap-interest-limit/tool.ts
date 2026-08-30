import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly netInterestExpense: number;
  readonly taxEbitda: number;
  readonly ebitdaLimitPercent: number;
  readonly fixedCap: number;
}>;
export type Output = Readonly<{
  readonly ebitdaBasedLimit: number;
  readonly deductibleInterest: number;
  readonly disallowedInterest: number;
}>;

export const calculate = (input: Input): Output => {
  const ebitdaBasedLimit = (input.taxEbitda * input.ebitdaLimitPercent) / 100;
  const deductibleInterest = Math.min(
    input.netInterestExpense,
    Math.max(ebitdaBasedLimit, input.fixedCap),
  );
  return {
    ebitdaBasedLimit,
    deductibleInterest,
    disallowedInterest: input.netInterestExpense - deductibleInterest,
  };
};

export const exampleInput = {
  netInterestExpense: 500,
  taxEbitda: 1000,
  ebitdaLimitPercent: 30,
  fixedCap: 100,
} satisfies Input;
export const exampleOutput = {
  ebitdaBasedLimit: 300,
  deductibleInterest: 300,
  disallowedInterest: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      netInterestExpense: input.netInterestExpense as number,
      taxEbitda: input.taxEbitda as number,
      ebitdaLimitPercent: input.ebitdaLimitPercent as number,
      fixedCap: input.fixedCap as number,
    }),
  description:
    "Apply caller-supplied EBITDA and fixed caps to net interest expense.",
  id: "taxation/thin-cap-interest-limit",
  inputs: [
    {
      id: "netInterestExpense",
      label: "Net interest expense",
      kind: "number",
      minimum: 0,
    },
    { id: "taxEbitda", label: "Tax EBITDA", kind: "number", minimum: 0 },
    {
      id: "ebitdaLimitPercent",
      label: "Caller EBITDA limit",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    { id: "fixedCap", label: "Caller fixed cap", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "ebitdaBasedLimit",
      label: "EBITDA-based limit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "deductibleInterest",
      label: "Deductible interest",
      kind: "number",
      minimum: 0,
    },
    {
      id: "disallowedInterest",
      label: "Disallowed interest",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Thin-Cap Interest Limit",
});

export const run = tool.execute;
export default tool;
