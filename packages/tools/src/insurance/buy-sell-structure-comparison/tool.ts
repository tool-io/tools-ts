import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly crossPurchaseScores: readonly number[];
  readonly entityRedemptionScores: readonly number[];
}>;
export type Output = Readonly<{
  readonly crossPurchaseTotal: number;
  readonly entityRedemptionTotal: number;
  readonly higherScoringStructure: string;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.crossPurchaseScores.length === 0 ||
    input.crossPurchaseScores.length !== input.entityRedemptionScores.length
  )
    simpleError(
      "crossPurchaseScores",
      "Score lists must be nonempty and equal length.",
      "length_mismatch",
    );
  const sum = (values: readonly number[]) =>
    values.reduce((total, value) => total + value, 0);
  const crossPurchaseTotal = sum(input.crossPurchaseScores);
  const entityRedemptionTotal = sum(input.entityRedemptionScores);
  return {
    crossPurchaseTotal,
    entityRedemptionTotal,
    higherScoringStructure:
      crossPurchaseTotal === entityRedemptionTotal
        ? "tie"
        : crossPurchaseTotal > entityRedemptionTotal
          ? "cross-purchase"
          : "entity-redemption",
  };
};

export const exampleInput = {
  crossPurchaseScores: [4, 3, 2],
  entityRedemptionScores: [3, 4, 1],
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  crossPurchaseScores: [1, 1],
  entityRedemptionScores: [1, 1],
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      crossPurchaseScores: input.crossPurchaseScores as readonly number[],
      entityRedemptionScores: input.entityRedemptionScores as readonly number[],
    }),
  description:
    "Compare caller-assigned criterion scores without making legal or tax recommendations.",
  id: "insurance/buy-sell-structure-comparison",
  inputs: [
    {
      id: "crossPurchaseScores",
      label: "Cross-purchase scores",
      kind: "numberList",
    },
    {
      id: "entityRedemptionScores",
      label: "Entity-redemption scores",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "crossPurchaseTotal", label: "Cross-purchase total", kind: "number" },
    {
      id: "entityRedemptionTotal",
      label: "Entity-redemption total",
      kind: "number",
    },
    {
      id: "higherScoringStructure",
      label: "Higher-scoring structure",
      kind: "string",
      enum: ["cross-purchase", "entity-redemption", "tie"],
    },
  ],
  title: "Buy-Sell Structure Comparison",
});

export const run = tool.execute;
export default tool;
