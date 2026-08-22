import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RunwayRequiredTakeoffInput = {
  readonly groundRollFt: number;
  readonly headwindKt: number;
};

export type RunwayRequiredTakeoffOutput = {
  readonly requiredDistanceFt: number;
};

/** Rule of thumb: each knot of headwind reduces the roll by one percent. */
const REDUCTION_PER_KT = 0.01;
const MINIMUM_FACTOR = 0.5;

export const runwayRequiredTakeoffExample = {
  input: { groundRollFt: 1000, headwindKt: 10 },
  output: { requiredDistanceFt: 900 },
} satisfies ToolExample<
  RunwayRequiredTakeoffInput,
  RunwayRequiredTakeoffOutput
>;

export const calculateRunwayRequiredTakeoff = (
  input: RunwayRequiredTakeoffInput,
): RunwayRequiredTakeoffOutput => {
  if (input.groundRollFt <= 0)
    simpleError(
      "groundRollFt",
      "The ground roll must be positive.",
      "invalid_distance",
    );
  const factor = Math.max(
    MINIMUM_FACTOR,
    1 - Math.max(0, input.headwindKt) * REDUCTION_PER_KT,
  );
  return {
    requiredDistanceFt: input.groundRollFt * factor,
  };
};

export const runwayRequiredTakeoffTool = createSimpleTool({
  calculate: (input) =>
    calculateRunwayRequiredTakeoff(
      input as unknown as RunwayRequiredTakeoffInput,
    ),
  description:
    "Compute the takeoff distance required after adjusting for a headwind component.",
  id: "aviation/runway-required-takeoff",
  inputs: [
    {
      description: "Published no-wind ground roll distance.",
      id: "groundRollFt",
      kind: "number",
      label: "Ground roll",
      unit: "ft",
    },
    {
      description: "Headwind component on the runway.",
      id: "headwindKt",
      kind: "number",
      label: "Headwind",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Adjusted takeoff roll with headwind.",
      format: "length-ft",
      id: "requiredDistanceFt",
      kind: "number",
      label: "Required takeoff distance",
      unit: "ft",
    },
  ],
  title: "Runway Required Takeoff Calculator",
});
export const runRunwayRequiredTakeoff = runwayRequiredTakeoffTool.execute;
export default runwayRequiredTakeoffTool;
