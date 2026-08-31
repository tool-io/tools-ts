import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch-shared.js";
export type Input = Readonly<{
  readonly firstBaseCurrency: string;
  readonly firstQuoteCurrency: string;
  readonly firstQuoteUnitsPerBase: number;
  readonly secondBaseCurrency: string;
  readonly secondQuoteCurrency: string;
  readonly secondQuoteUnitsPerBase: number;
  readonly observedDirectCrossQuote: number;
}>;
export type Output = Readonly<{
  readonly derivedCrossBaseCurrency: string;
  readonly derivedCrossQuoteCurrency: string;
  readonly derivedCrossQuoteUnitsPerBase: number;
  readonly signedDirectMinusDerivedQuote: number;
  readonly signedDirectRelativeGapPercent: number;
}>;
const inputFields = [
  { id: "firstBaseCurrency", label: "First base currency", kind: "string" },
  { id: "firstQuoteCurrency", label: "First quote currency", kind: "string" },
  {
    id: "firstQuoteUnitsPerBase",
    label: "First quote units per base",
    kind: "number",
  },
  { id: "secondBaseCurrency", label: "Second base currency", kind: "string" },
  { id: "secondQuoteCurrency", label: "Second quote currency", kind: "string" },
  {
    id: "secondQuoteUnitsPerBase",
    label: "Second quote units per base",
    kind: "number",
  },
  {
    id: "observedDirectCrossQuote",
    label: "Observed direct cross quote",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.firstQuoteUnitsPerBase, "firstQuoteUnitsPerBase");
  positive(input.secondQuoteUnitsPerBase, "secondQuoteUnitsPerBase");
  positive(input.observedDirectCrossQuote, "observedDirectCrossQuote");
  const labels = [
    input.firstBaseCurrency,
    input.firstQuoteCurrency,
    input.secondBaseCurrency,
    input.secondQuoteCurrency,
  ];
  if (
    labels.some((v) => !/^[A-Z]{3}$(?![\s\S])/.test(v)) ||
    input.firstQuoteCurrency !== input.secondBaseCurrency ||
    new Set([
      input.firstBaseCurrency,
      input.firstQuoteCurrency,
      input.secondQuoteCurrency,
    ]).size !== 3
  )
    simpleError(
      "currency",
      "Explicit distinct three-letter currency legs with matching bridge orientation required.",
    );
  const cross = positive(
      input.firstQuoteUnitsPerBase * input.secondQuoteUnitsPerBase,
      "crossQuote",
    ),
    gap = input.observedDirectCrossQuote - cross;
  return {
    derivedCrossBaseCurrency: input.firstBaseCurrency,
    derivedCrossQuoteCurrency: input.secondQuoteCurrency,
    derivedCrossQuoteUnitsPerBase: cross,
    signedDirectMinusDerivedQuote: gap,
    signedDirectRelativeGapPercent: (100 * gap) / cross,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstBaseCurrency: "EUR",
  firstQuoteCurrency: "USD",
  firstQuoteUnitsPerBase: 1.2,
  secondBaseCurrency: "USD",
  secondQuoteCurrency: "JPY",
  secondQuoteUnitsPerBase: 150,
  observedDirectCrossQuote: 181,
} satisfies Input;
export const exampleOutput = {
  derivedCrossBaseCurrency: "EUR",
  derivedCrossQuoteCurrency: "JPY",
  derivedCrossQuoteUnitsPerBase: 180,
  signedDirectMinusDerivedQuote: 1,
  signedDirectRelativeGapPercent: 0.5555555555555556,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/cross-rate-triangular-computation",
  title: "Cross Rate Triangular Computation Tool",
  description:
    "Reconcile caller explicitly oriented currency quote legs with observed direct cross, exposing signed triangular discrepancy; currencies/market simultaneity, bid-ask spreads and executable arbitrage are not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "derivedCrossBaseCurrency",
      label: "Derived cross base currency",
      kind: "string",
    },
    {
      id: "derivedCrossQuoteCurrency",
      label: "Derived cross quote currency",
      kind: "string",
    },
    {
      id: "derivedCrossQuoteUnitsPerBase",
      label: "Derived cross quote units per base",
      kind: "number",
    },
    {
      id: "signedDirectMinusDerivedQuote",
      label: "Signed direct minus derived quote",
      kind: "number",
    },
    {
      id: "signedDirectRelativeGapPercent",
      label: "Signed direct relative gap percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstBaseCurrency: value.firstBaseCurrency as string,
      firstQuoteCurrency: value.firstQuoteCurrency as string,
      firstQuoteUnitsPerBase: value.firstQuoteUnitsPerBase as number,
      secondBaseCurrency: value.secondBaseCurrency as string,
      secondQuoteCurrency: value.secondQuoteCurrency as string,
      secondQuoteUnitsPerBase: value.secondQuoteUnitsPerBase as number,
      observedDirectCrossQuote: value.observedDirectCrossQuote as number,
    }),
});
export const run = tool.execute;
export default tool;
