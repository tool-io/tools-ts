import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SedimentationRateInput = {
  readonly sedimentThicknessM: number;
  readonly durationMillionYears: number;
};

export type SedimentationRateOutput = {
  readonly sedimentationRateMPerMillionYears: number;
  readonly sedimentationRateCmPerKyr: number;
};

export const calculateSedimentationRate = (
  input: SedimentationRateInput,
): SedimentationRateOutput => {
  const { sedimentThicknessM, durationMillionYears } = input;
  if (!(sedimentThicknessM >= 0))
    simpleError(
      "sedimentThicknessM",
      "Sediment thickness must be non-negative.",
      "invalid_thickness",
    );
  if (!(durationMillionYears > 0))
    simpleError(
      "durationMillionYears",
      "Duration must be greater than zero.",
      "invalid_duration",
    );
  const rateMPerMillionYears = sedimentThicknessM / durationMillionYears;
  return {
    sedimentationRateMPerMillionYears: rateMPerMillionYears,
    sedimentationRateCmPerKyr: rateMPerMillionYears * 0.1,
  };
};

export const sedimentationRateExample = {
  input: { sedimentThicknessM: 850, durationMillionYears: 17 },
  output: {
    sedimentationRateMPerMillionYears: 50,
    sedimentationRateCmPerKyr: 5,
  },
} satisfies ToolExample<SedimentationRateInput, SedimentationRateOutput>;

export const sedimentationRateTool = createSimpleTool({
  id: "geology/sedimentation-rate",
  title: "Sedimentation Rate Calculator",
  description:
    "Average sedimentation (accumulation) rate from compacted sediment thickness divided by deposition time; reported in m/Myr and cm/kyr.",
  inputs: [
    {
      description: "Preserved (compacted) sediment thickness in metres.",
      id: "sedimentThicknessM",
      kind: "number",
      label: "Sediment thickness",
      unit: "m",
    },
    {
      description: "Duration of deposition in millions of years.",
      id: "durationMillionYears",
      kind: "number",
      label: "Duration",
      unit: "Myr",
    },
  ],
  outputs: [
    {
      description: "Mean accumulation rate in metres per million years.",
      id: "sedimentationRateMPerMillionYears",
      kind: "number",
      label: "Rate",
      unit: "m/Myr",
    },
    {
      description: "Mean accumulation rate in centimetres per thousand years.",
      id: "sedimentationRateCmPerKyr",
      kind: "number",
      label: "Rate",
      unit: "cm/kyr",
    },
  ],
  calculate: (input) =>
    calculateSedimentationRate(input as unknown as SedimentationRateInput),
});

export const runSedimentationRate = sedimentationRateTool.execute;
export default sedimentationRateTool;
