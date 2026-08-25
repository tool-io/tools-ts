import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type BrixToSpecificGravityInput = {
  readonly brix: number;
};

export type BrixToSpecificGravityOutput = {
  readonly specificGravity: number;
};

export const brixToSpecificGravityExample = {
  input: {
    brix: 20,
  },
  output: {
    specificGravity: 1.08298445793,
  },
} satisfies ToolExample<
  BrixToSpecificGravityInput,
  BrixToSpecificGravityOutput
>;

export const calculateBrixToSpecificGravity = (
  input: BrixToSpecificGravityInput,
): BrixToSpecificGravityOutput => {
  const divisor = 258.6 - (input.brix / 258.2) * 227.1;
  if (divisor <= 0)
    simpleError(
      "brix",
      "The Brix value is outside the range covered by this conversion.",
      "invalid_value",
    );
  return { specificGravity: roundStatistic(1 + input.brix / divisor) };
};

export const brixToSpecificGravityTool = createSimpleTool({
  calculate: (input) =>
    calculateBrixToSpecificGravity(
      input as unknown as BrixToSpecificGravityInput,
    ),
  description:
    "Estimate solution specific gravity from degrees Brix with an empirical brewing and winemaking conversion; temperature, dissolved non-sugars, and alcohol can make measured must or wine differ.",
  id: "oenology/brix-to-specific-gravity",
  inputs: [
    {
      description: "Dissolved sugar concentration in degrees Brix.",
      id: "brix",
      label: "Brix",
      kind: "number",
      maximum: 100,
      minimum: 0,
      unit: "°Bx",
    },
  ],
  outputs: [
    {
      description: "Estimated specific gravity of the sugar solution.",
      id: "specificGravity",
      kind: "number",
      label: "Specific gravity",
    },
  ],
  title: "Brix to Specific Gravity Converter",
});
export const runBrixToSpecificGravity = brixToSpecificGravityTool.execute;
export default brixToSpecificGravityTool;
