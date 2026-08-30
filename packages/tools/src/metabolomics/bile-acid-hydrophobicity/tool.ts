import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly bileAcidAmounts: readonly number[];
  readonly hydrophobicityWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly weightedHydrophobicity: number;
  readonly totalAmount: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.bileAcidAmounts.length;
  if (
    n === 0 ||
    input.hydrophobicityWeights.length !== n ||
    input.bileAcidAmounts.some((v) => v < 0)
  )
    simpleError(
      "bileAcidAmounts",
      "Aligned nonnegative amounts and hydrophobicity weights required.",
    );
  const totalAmount = input.bileAcidAmounts.reduce((a, b) => a + b, 0);
  if (totalAmount <= 0)
    simpleError("bileAcidAmounts", "Bile acid pool must be positive.");
  return {
    weightedHydrophobicity:
      input.bileAcidAmounts.reduce(
        (s, v, i) => s + v * input.hydrophobicityWeights[i],
        0,
      ) / totalAmount,
    totalAmount,
  };
};
export const exampleInput = {
  bileAcidAmounts: [1, 3],
  hydrophobicityWeights: [-1, 1],
} satisfies Input;
export const exampleOutput = {
  weightedHydrophobicity: 0.5,
  totalAmount: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/bile-acid-hydrophobicity",
  title: "Bile Acid Hydrophobicity",
  description:
    "Compute a weighted bile-acid hydrophobicity index from caller weights.",
  inputs: [
    { id: "bileAcidAmounts", kind: "numberList", label: "Bile acid amounts" },
    {
      id: "hydrophobicityWeights",
      kind: "numberList",
      label: "Hydrophobicity weights",
    },
  ],
  outputs: [
    {
      id: "weightedHydrophobicity",
      kind: "number",
      label: "Weighted hydrophobicity",
    },
    { id: "totalAmount", kind: "number", label: "Total amount" },
  ],
  calculate: (value) =>
    calculate({
      bileAcidAmounts: value.bileAcidAmounts as readonly number[],
      hydrophobicityWeights: value.hydrophobicityWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
