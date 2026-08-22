import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UsefulLoadInput = {
  readonly basicEmptyWeightLb: number;
  readonly maxTakeoffWeightLb: number;
};

export type UsefulLoadOutput = {
  readonly usefulLoadLb: number;
};

export const usefulLoadExample = {
  input: { basicEmptyWeightLb: 1600, maxTakeoffWeightLb: 2400 },
  output: { usefulLoadLb: 800 },
} satisfies ToolExample<UsefulLoadInput, UsefulLoadOutput>;

export const calculateUsefulLoad = (
  input: UsefulLoadInput,
): UsefulLoadOutput => {
  if (input.basicEmptyWeightLb < 0 || input.maxTakeoffWeightLb <= 0)
    simpleError(
      "basicEmptyWeightLb",
      "Weights must be non-negative with a positive maximum.",
      "invalid_weight",
    );
  return {
    usefulLoadLb: input.maxTakeoffWeightLb - input.basicEmptyWeightLb,
  };
};

export const usefulLoadTool = createSimpleTool({
  calculate: (input) =>
    calculateUsefulLoad(input as unknown as UsefulLoadInput),
  description:
    "Compute the useful load as the difference between max takeoff weight and empty weight.",
  id: "aviation/useful-load",
  inputs: [
    {
      description: "Basic empty weight of the aircraft.",
      id: "basicEmptyWeightLb",
      kind: "number",
      label: "Empty weight",
      unit: "lb",
    },
    {
      description: "Maximum certified takeoff weight.",
      id: "maxTakeoffWeightLb",
      kind: "number",
      label: "Max takeoff weight",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Combined weight of crew, passengers, cargo, and fuel.",
      format: "weight-lb",
      id: "usefulLoadLb",
      kind: "number",
      label: "Useful load",
      unit: "lb",
    },
  ],
  title: "Useful Load Calculator",
});
export const runUsefulLoad = usefulLoadTool.execute;
export default usefulLoadTool;
