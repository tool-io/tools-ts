import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SeaStateLookupInput = {
  readonly significantWaveHeightMeters: number;
};

export type SeaStateLookupOutput = {
  readonly douglasState: number;
};

const DOUGLAS_UPPER_BOUNDS_M = [0, 0.1, 0.5, 1.25, 2.5, 4, 6, 9, 14];

export const seaStateLookupExample = {
  input: { significantWaveHeightMeters: 2 },
  output: { douglasState: 4 },
} satisfies ToolExample<SeaStateLookupInput, SeaStateLookupOutput>;

export const calculateSeaStateLookup = (
  input: SeaStateLookupInput,
): SeaStateLookupOutput => {
  const state = DOUGLAS_UPPER_BOUNDS_M.findIndex(
    (upperBoundM) => input.significantWaveHeightMeters <= upperBoundM,
  );
  return { douglasState: state === -1 ? 9 : state };
};

export const seaStateLookupTool = createSimpleTool({
  calculate: (input) =>
    calculateSeaStateLookup(input as unknown as SeaStateLookupInput),
  description:
    "Look up the Douglas sea state from zero to nine for a significant wave height in meters using standard inclusive upper bounds.",
  id: "sailing/sea-state-lookup",
  inputs: [
    {
      description:
        "Significant wave height used to classify the Douglas sea state.",
      id: "significantWaveHeightMeters",
      kind: "number",
      label: "Significant wave height",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      description:
        "Douglas sea state from zero (calm, glassy) through nine (phenomenal).",
      id: "douglasState",
      kind: "integer",
      label: "Douglas sea state",
    },
  ],
  title: "Douglas Sea State Lookup",
});
export const runSeaStateLookup = seaStateLookupTool.execute;
export default seaStateLookupTool;
