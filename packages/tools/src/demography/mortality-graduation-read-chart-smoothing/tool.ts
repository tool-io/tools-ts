import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MortalityGraduationReadChartSmoothingInput = {
  readonly centralDeathRates: readonly number[];
  readonly passes?: number;
};

export type MortalityGraduationReadChartSmoothingOutput = {
  readonly graduatedRates: number[];
};

const graduateOnce = (rates: readonly number[]): number[] => {
  const output = [rates[0]];
  for (let i = 1; i < rates.length - 1; i += 1)
    output.push((rates[i - 1] + 2 * rates[i] + rates[i + 1]) / 4);
  output.push(rates[rates.length - 1]);
  return output;
};

export const calculateMortalityGraduationReadChartSmoothing = (
  input: MortalityGraduationReadChartSmoothingInput,
): MortalityGraduationReadChartSmoothingOutput => {
  if (input.centralDeathRates.length < 3)
    return simpleError(
      "centralDeathRates",
      "Provide at least three age points to graduate.",
      "invalid_schedule",
    );
  for (const rate of input.centralDeathRates) {
    if (!(rate >= 0))
      return simpleError(
        "centralDeathRates",
        "Central death rates must be non-negative.",
        "invalid_schedule",
      );
  }
  const passes = input.passes ?? 1;
  if (!Number.isSafeInteger(passes) || passes < 1 || passes > 20)
    return simpleError(
      "passes",
      "The number of smoothing passes must be an integer from one to twenty.",
      "invalid_passes",
    );
  let graduatedRates: number[] = [...input.centralDeathRates];
  for (let pass = 0; pass < passes; pass += 1)
    graduatedRates = graduateOnce(graduatedRates);
  return { graduatedRates };
};

export const mortalityGraduationReadChartSmoothingExample = {
  input: { centralDeathRates: [0.02, 0.03, 0.09, 0.15, 0.28], passes: 1 },
  output: { graduatedRates: [0.02, 0.042499999999999996, 0.09, 0.1675, 0.28] },
} satisfies ToolExample<
  MortalityGraduationReadChartSmoothingInput,
  MortalityGraduationReadChartSmoothingOutput
>;

export const mortalityGraduationReadChartSmoothingTool = createSimpleTool({
  id: "demography/mortality-graduation-read-chart-smoothing",
  title: "Mortality Graduation Chart Smoothing",
  description:
    "Graduate a schedule of central death rates for charting by applying the symmetric 1-2-1 weighted moving average (weights one, two, one over four) across ages, holding the first and last observed values fixed and repeating for the requested number of passes.",
  inputs: [
    {
      description: "Observed central death rates m(x) in age order.",
      id: "centralDeathRates",
      kind: "numberList",
      label: "m(x)",
    },
    {
      default: 1,
      description: "How many times to apply the smoothing kernel.",
      id: "passes",
      kind: "integer",
      label: "Passes",
      maximum: 20,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Graduated central death rates of the same length.",
      id: "graduatedRates",
      kind: "numberList",
      label: "Graduated",
    },
  ],
  calculate: (input) =>
    calculateMortalityGraduationReadChartSmoothing(
      input as unknown as MortalityGraduationReadChartSmoothingInput,
    ),
});

export const runMortalityGraduationReadChartSmoothing =
  mortalityGraduationReadChartSmoothingTool.execute;
export default mortalityGraduationReadChartSmoothingTool;
