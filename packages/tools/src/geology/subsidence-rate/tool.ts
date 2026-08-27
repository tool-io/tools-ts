import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SubsidenceRateInput = {
  readonly subsidenceAmountM: number;
  readonly durationMillionYears: number;
};

export type SubsidenceRateOutput = {
  readonly subsidenceRateMPerMillionYears: number;
};

export const calculateSubsidenceRate = (
  input: SubsidenceRateInput,
): SubsidenceRateOutput => {
  const { subsidenceAmountM, durationMillionYears } = input;
  if (!(subsidenceAmountM >= 0))
    simpleError(
      "subsidenceAmountM",
      "Subsidence amount must be non-negative.",
      "invalid_amount",
    );
  if (!(durationMillionYears > 0))
    simpleError(
      "durationMillionYears",
      "Duration must be greater than zero.",
      "invalid_duration",
    );
  return {
    subsidenceRateMPerMillionYears: subsidenceAmountM / durationMillionYears,
  };
};

export const subsidenceRateExample = {
  input: { subsidenceAmountM: 1250, durationMillionYears: 25 },
  output: { subsidenceRateMPerMillionYears: 50 },
} satisfies ToolExample<SubsidenceRateInput, SubsidenceRateOutput>;

export const subsidenceRateTool = createSimpleTool({
  id: "geology/subsidence-rate",
  title: "Subsidence Rate Calculator",
  description:
    "Average tectonic-plus-loaded subsidence rate over an interval: amount divided by duration.",
  inputs: [
    {
      description: "Total subsidence of the interval in metres.",
      id: "subsidenceAmountM",
      kind: "number",
      label: "Subsidence",
      unit: "m",
    },
    {
      description: "Duration of the interval in millions of years.",
      id: "durationMillionYears",
      kind: "number",
      label: "Duration",
      unit: "Myr",
    },
  ],
  outputs: [
    {
      description: "Mean subsidence rate in metres per million years.",
      id: "subsidenceRateMPerMillionYears",
      kind: "number",
      label: "Subsidence rate",
      unit: "m/Myr",
    },
  ],
  calculate: (input) =>
    calculateSubsidenceRate(input as unknown as SubsidenceRateInput),
});

export const runSubsidenceRate = subsidenceRateTool.execute;
export default subsidenceRateTool;
