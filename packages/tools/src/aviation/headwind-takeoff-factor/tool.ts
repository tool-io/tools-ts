import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeadwindTakeoffFactorInput = {
  readonly headwindKt: number;
};

export type HeadwindTakeoffFactorOutput = {
  readonly factor: number;
};

/** Rule of thumb: each knot of headwind shortens the roll by one percent. */
const FACTOR_PER_KT = 0.01;
const MINIMUM_FACTOR = 0.5;

export const headwindTakeoffFactorExample = {
  input: { headwindKt: 20 },
  output: { factor: 0.8 },
} satisfies ToolExample<
  HeadwindTakeoffFactorInput,
  HeadwindTakeoffFactorOutput
>;

export const calculateHeadwindTakeoffFactor = (
  input: HeadwindTakeoffFactorInput,
): HeadwindTakeoffFactorOutput => {
  if (input.headwindKt < 0)
    simpleError(
      "headwindKt",
      "The headwind cannot be negative.",
      "invalid_wind",
    );
  return {
    factor: Math.max(MINIMUM_FACTOR, 1 - input.headwindKt * FACTOR_PER_KT),
  };
};

export const headwindTakeoffFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateHeadwindTakeoffFactor(
      input as unknown as HeadwindTakeoffFactorInput,
    ),
  description:
    "Compute the planning multiplier that shortens takeoff distance for a given headwind.",
  id: "aviation/headwind-takeoff-factor",
  inputs: [
    {
      description: "Headwind component on the runway.",
      id: "headwindKt",
      kind: "number",
      label: "Headwind",
      unit: "kt",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Multiplier to apply to the no-wind takeoff distance; floored at fifty percent.",
      format: "factor",
      id: "factor",
      kind: "number",
      label: "Distance factor",
    },
  ],
  title: "Headwind Takeoff Factor Calculator",
});
export const runHeadwindTakeoffFactor = headwindTakeoffFactorTool.execute;
export default headwindTakeoffFactorTool;
