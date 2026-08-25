import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type StarterPitchRateInput = {
  readonly mustVolumeLiters: number;
  readonly starterPercent?: number;
};

export type StarterPitchRateOutput = {
  readonly starterVolumeLiters: number;
};

export const starterPitchRateExample = {
  input: {
    mustVolumeLiters: 1000,
    starterPercent: 2,
  },
  output: {
    starterVolumeLiters: 20,
  },
} satisfies ToolExample<StarterPitchRateInput, StarterPitchRateOutput>;

export const calculateStarterPitchRate = (
  input: StarterPitchRateInput,
): StarterPitchRateOutput => {
  const percent = input.starterPercent ?? 2;
  if (percent < 0)
    simpleError(
      "starterPercent",
      "The starter percentage cannot be negative.",
      "invalid_value",
    );
  return {
    starterVolumeLiters: roundStatistic(
      (input.mustVolumeLiters * percent) / 100,
    ),
  };
};

export const starterPitchRateTool = createSimpleTool({
  calculate: (input) =>
    calculateStarterPitchRate(input as unknown as StarterPitchRateInput),
  description:
    "Scale a yeast starter from the must volume using a percentage pitch rate.",
  id: "oenology/starter-pitch-rate",
  inputs: [
    {
      description: "Total must volume to ferment.",
      id: "mustVolumeLiters",
      kind: "number",
      label: "Must volume",
      minimum: 0,
      unit: "L",
    },
    {
      default: 2,
      description:
        "Starter volume as a share of the must; two percent is a typical cellar rate.",
      id: "starterPercent",
      kind: "number",
      label: "Starter rate",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Active starter volume to build and pitch.",
      id: "starterVolumeLiters",
      kind: "number",
      label: "Starter volume",
      unit: "L",
    },
  ],
  title: "Starter Culture Pitch Rate Calculator",
});
export const runStarterPitchRate = starterPitchRateTool.execute;
export default starterPitchRateTool;
