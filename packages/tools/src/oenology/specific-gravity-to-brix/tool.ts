import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type SpecificGravityToBrixInput = {
  readonly specificGravity: number;
};

export type SpecificGravityToBrixOutput = {
  readonly brix: number;
};

export const specificGravityToBrixExample = {
  input: {
    specificGravity: 1.083,
  },
  output: {
    brix: 20.003490931,
  },
} satisfies ToolExample<
  SpecificGravityToBrixInput,
  SpecificGravityToBrixOutput
>;

export const calculateSpecificGravityToBrix = (
  input: SpecificGravityToBrixInput,
): SpecificGravityToBrixOutput => {
  const densityDelta = input.specificGravity - 1;
  const brix = (densityDelta * 258.6) / (1 + (densityDelta * 227.1) / 258.2);
  return { brix: roundStatistic(brix) };
};

export const specificGravityToBrixTool = createSimpleTool({
  calculate: (input) =>
    calculateSpecificGravityToBrix(
      input as unknown as SpecificGravityToBrixInput,
    ),
  description:
    "Convert a hydrometer specific gravity reading to dissolved sugar in degrees Brix.",
  id: "oenology/specific-gravity-to-brix",
  inputs: [
    {
      description:
        "Specific gravity of an unfermented sugar solution; alcohol makes this conversion unreliable after fermentation begins.",
      id: "specificGravity",
      label: "Specific gravity",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Dissolved sugar concentration in degrees Brix.",
      id: "brix",
      kind: "number",
      label: "Brix",
    },
  ],
  title: "Specific Gravity to Brix Converter",
});
export const runSpecificGravityToBrix = specificGravityToBrixTool.execute;
export default specificGravityToBrixTool;
