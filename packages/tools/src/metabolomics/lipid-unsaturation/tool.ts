import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lipidChainCarbonCounts: readonly number[];
  readonly lipidChainDoubleBonds: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalCarbons: number;
  readonly totalDoubleBonds: number;
  readonly totalHydrogenSitesLost: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.lipidChainCarbonCounts.length;
  if (
    n === 0 ||
    input.lipidChainDoubleBonds.length !== n ||
    [...input.lipidChainCarbonCounts, ...input.lipidChainDoubleBonds].some(
      (v) => !Number.isSafeInteger(v) || v < 0,
    )
  )
    simpleError(
      "lipidChainDoubleBonds",
      "Aligned nonnegative integer lipid-chain counts required.",
    );
  const totalDoubleBonds = input.lipidChainDoubleBonds.reduce(
    (a, b) => a + b,
    0,
  );
  return {
    totalCarbons: input.lipidChainCarbonCounts.reduce((a, b) => a + b, 0),
    totalDoubleBonds,
    totalHydrogenSitesLost: 2 * totalDoubleBonds,
  };
};
export const exampleInput = {
  lipidChainCarbonCounts: [16, 18],
  lipidChainDoubleBonds: [0, 2],
} satisfies Input;
export const exampleOutput = {
  totalCarbons: 34,
  totalDoubleBonds: 2,
  totalHydrogenSitesLost: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/lipid-unsaturation",
  title: "Lipid Unsaturation",
  description: "Tally lipid-chain carbons and unsaturation sites.",
  inputs: [
    {
      id: "lipidChainCarbonCounts",
      kind: "numberList",
      label: "Lipid chain carbon counts",
    },
    {
      id: "lipidChainDoubleBonds",
      kind: "numberList",
      label: "Lipid chain double bonds",
    },
  ],
  outputs: [
    { id: "totalCarbons", kind: "number", label: "Total carbons" },
    { id: "totalDoubleBonds", kind: "number", label: "Total double bonds" },
    {
      id: "totalHydrogenSitesLost",
      kind: "number",
      label: "Total hydrogen sites lost",
    },
  ],
  calculate: (value) =>
    calculate({
      lipidChainCarbonCounts: value.lipidChainCarbonCounts as readonly number[],
      lipidChainDoubleBonds: value.lipidChainDoubleBonds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
