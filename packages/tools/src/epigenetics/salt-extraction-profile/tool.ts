import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly saltConcentrationsMm: readonly number[];
  readonly solubleFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly peakSolubilityConcentrationMm: number;
  readonly peakSolubleFraction: number;
  readonly weightedMeanConcentrationMm: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.saltConcentrationsMm.length;
  if (
    n === 0 ||
    input.solubleFractions.length !== n ||
    input.solubleFractions.some((value) => value < 0)
  )
    simpleError(
      "saltConcentrationsMm",
      "Aligned concentrations and nonnegative fractions are required.",
      "invalid_profile",
    );
  const peak = Math.max(...input.solubleFractions),
    index = input.solubleFractions.indexOf(peak),
    total = input.solubleFractions.reduce((a, b) => a + b, 0);
  if (total <= 0)
    simpleError(
      "solubleFractions",
      "Total soluble fraction must be positive.",
      "zero_profile",
    );
  return {
    peakSolubilityConcentrationMm: input.saltConcentrationsMm[index],
    peakSolubleFraction: peak,
    weightedMeanConcentrationMm:
      input.saltConcentrationsMm.reduce(
        (sum, value, i) => sum + value * input.solubleFractions[i],
        0,
      ) / total,
  };
};

export const exampleInput = {
  saltConcentrationsMm: [100, 300, 500],
  solubleFractions: [0.1, 0.6, 0.3],
} satisfies Input;
export const exampleOutput = {
  peakSolubilityConcentrationMm: 300,
  peakSolubleFraction: 0.6,
  weightedMeanConcentrationMm: 340,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      saltConcentrationsMm: input.saltConcentrationsMm as readonly number[],
      solubleFractions: input.solubleFractions as readonly number[],
    }),
  description: "Summarize a chromatin salt-extraction solubility profile.",
  id: "epigenetics/salt-extraction-profile",
  inputs: [
    {
      id: "saltConcentrationsMm",
      label: "Salt concentrations",
      kind: "numberList",
      unit: "mM",
    },
    {
      id: "solubleFractions",
      label: "Soluble chromatin fractions",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "peakSolubilityConcentrationMm",
      label: "Concentration at peak solubility",
      kind: "number",
      unit: "mM",
    },
    {
      id: "peakSolubleFraction",
      label: "Peak soluble fraction",
      kind: "number",
    },
    {
      id: "weightedMeanConcentrationMm",
      label: "Solubility-weighted concentration",
      kind: "number",
      unit: "mM",
    },
  ],
  title: "Salt Extraction Profile",
});

export const run = tool.execute;
export default tool;
