import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const GRAVITY_MS2 = 9.80665;

export type FroudeNumberInput = {
  readonly lengthMeters: number;
  readonly speedMs: number;
};

export type FroudeNumberOutput = {
  readonly froudeNumber: number;
};

export const froudeNumberExample = {
  input: { lengthMeters: 25, speedMs: 5 },
  output: { froudeNumber: 0.3193299567810587 },
} satisfies ToolExample<FroudeNumberInput, FroudeNumberOutput>;

export const froudeNumberTool = createSimpleTool({
  calculate: (input) => {
    const lengthMeters = input.lengthMeters as number;
    const speedMs = input.speedMs as number;
    if (speedMs < 0)
      simpleError("speedMs", "Speed cannot be negative.", "invalid_input");
    if (lengthMeters <= 0)
      simpleError("lengthMeters", "Length must be positive.", "invalid_input");
    return {
      froudeNumber: speedMs / Math.sqrt(GRAVITY_MS2 * lengthMeters),
    };
  },
  description:
    "Compute the Froude number using froudeNumber = speedMs / sqrt(9.80665 * lengthMeters).",
  id: "sailing/froude-number",
  inputs: [
    {
      description: "Waterline length of the vessel.",
      id: "lengthMeters",
      kind: "number",
      label: "Length",
      unit: "m",
    },
    {
      description: "Speed of the vessel through the water.",
      id: "speedMs",
      kind: "number",
      label: "Speed",
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Dimensionless ratio of speed to hull-wave speed.",
      id: "froudeNumber",
      kind: "number",
      label: "Froude number",
    },
  ],
  title: "Froude Number Calculator",
});
export const runFroudeNumber = froudeNumberTool.execute;
export default froudeNumberTool;
