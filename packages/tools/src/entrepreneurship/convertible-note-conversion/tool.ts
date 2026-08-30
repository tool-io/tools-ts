import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, positive, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly principal: number;
  readonly annualSimpleInterest: number;
  readonly yearsElapsed: number;
  readonly roundSharePrice: number;
  readonly discountFraction: number;
  readonly valuationCap: number;
  readonly capitalizationShares: number;
}>;
export type Output = Readonly<{
  readonly accruedBalance: number;
  readonly conversionPrice: number;
  readonly conversionShares: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.principal, "principal");
  nonnegative(input.annualSimpleInterest, "annualSimpleInterest");
  nonnegative(input.yearsElapsed, "yearsElapsed");
  positive(input.roundSharePrice, "roundSharePrice");
  fraction(input.discountFraction, "discountFraction");
  if (input.discountFraction === 1)
    simpleError("discountFraction", "Discount must be less than one.");
  positive(input.valuationCap, "valuationCap");
  positive(input.capitalizationShares, "capitalizationShares");
  const accruedBalance =
      input.principal * (1 + input.annualSimpleInterest * input.yearsElapsed),
    conversionPrice = Math.min(
      input.roundSharePrice * (1 - input.discountFraction),
      input.valuationCap / input.capitalizationShares,
    );
  return {
    accruedBalance,
    conversionPrice,
    conversionShares: accruedBalance / conversionPrice,
  };
};
export const exampleInput = {
  principal: 1000,
  annualSimpleInterest: 0.1,
  yearsElapsed: 1,
  roundSharePrice: 2,
  discountFraction: 0.2,
  valuationCap: 1000,
  capitalizationShares: 1000,
} satisfies Input;
export const exampleOutput = {
  accruedBalance: 1100,
  conversionPrice: 1,
  conversionShares: 1100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/convertible-note-conversion",
  title: "Convertible Note Conversion",
  description:
    "Convert simple-interest note principal plus interest at the lower cap or discount price.",
  inputs: [
    { id: "principal", label: "Principal", kind: "number" },
    {
      id: "annualSimpleInterest",
      label: "Annual simple interest",
      kind: "number",
    },
    { id: "yearsElapsed", label: "Years elapsed", kind: "number" },
    { id: "roundSharePrice", label: "Round share price", kind: "number" },
    { id: "discountFraction", label: "Discount fraction", kind: "number" },
    { id: "valuationCap", label: "Valuation cap", kind: "number" },
    {
      id: "capitalizationShares",
      label: "Capitalization shares",
      kind: "number",
    },
  ],
  outputs: [
    { id: "accruedBalance", label: "Accrued balance", kind: "number" },
    { id: "conversionPrice", label: "Conversion price", kind: "number" },
    { id: "conversionShares", label: "Conversion shares", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      principal: value.principal as number,
      annualSimpleInterest: value.annualSimpleInterest as number,
      yearsElapsed: value.yearsElapsed as number,
      roundSharePrice: value.roundSharePrice as number,
      discountFraction: value.discountFraction as number,
      valuationCap: value.valuationCap as number,
      capitalizationShares: value.capitalizationShares as number,
    }),
});
export const run = tool.execute;
export default tool;
