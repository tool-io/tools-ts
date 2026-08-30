import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly investment: number;
  readonly roundPrice: number;
  readonly discountFraction: number;
  readonly valuationCap: number;
  readonly capitalizationShares: number;
}>;
export type Output = Readonly<{
  readonly capPrice: number;
  readonly discountPrice: number;
  readonly selectedPrice: number;
  readonly convertedShares: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.investment, "investment");
  positive(input.roundPrice, "roundPrice");
  fraction(input.discountFraction, "discountFraction");
  if (input.discountFraction === 1)
    simpleError("discountFraction", "Discount must be below 100%.");
  positive(input.valuationCap, "valuationCap");
  positive(input.capitalizationShares, "capitalizationShares");
  const capPrice = input.valuationCap / input.capitalizationShares,
    discountPrice = input.roundPrice * (1 - input.discountFraction),
    selectedPrice = Math.min(capPrice, discountPrice);
  return {
    capPrice,
    discountPrice,
    selectedPrice,
    convertedShares: input.investment / selectedPrice,
  };
};
export const exampleInput = {
  investment: 1000,
  roundPrice: 2,
  discountFraction: 0.2,
  valuationCap: 1000,
  capitalizationShares: 1000,
} satisfies Input;
export const exampleOutput = {
  capPrice: 1,
  discountPrice: 1.6,
  selectedPrice: 1,
  convertedShares: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/safe-cap-discount-comparison",
  title: "SAFE Cap Discount Comparison",
  description:
    "Compare SAFE cap and discount conversion prices using supplied capitalization assumptions.",
  inputs: [
    { id: "investment", label: "Investment", kind: "number" },
    { id: "roundPrice", label: "Round price", kind: "number" },
    { id: "discountFraction", label: "Discount fraction", kind: "number" },
    { id: "valuationCap", label: "Valuation cap", kind: "number" },
    {
      id: "capitalizationShares",
      label: "Capitalization shares",
      kind: "number",
    },
  ],
  outputs: [
    { id: "capPrice", label: "Cap price", kind: "number" },
    { id: "discountPrice", label: "Discount price", kind: "number" },
    { id: "selectedPrice", label: "Selected price", kind: "number" },
    { id: "convertedShares", label: "Converted shares", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      investment: value.investment as number,
      roundPrice: value.roundPrice as number,
      discountFraction: value.discountFraction as number,
      valuationCap: value.valuationCap as number,
      capitalizationShares: value.capitalizationShares as number,
    }),
});
export const run = tool.execute;
export default tool;
