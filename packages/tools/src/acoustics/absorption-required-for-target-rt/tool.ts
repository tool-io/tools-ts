import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AbsorptionRequiredForTargetRtInput = Readonly<{
  readonly roomCubicMeters: number;
  readonly targetRt60Seconds: number;
}>;
export type AbsorptionRequiredForTargetRtOutput = Readonly<{
  readonly absorptionSabins: number;
}>;

export const calculateAbsorptionRequiredForTargetRt = (
  x: AbsorptionRequiredForTargetRtInput,
): AbsorptionRequiredForTargetRtOutput => {
  if (!Number.isFinite(x.roomCubicMeters) || x.roomCubicMeters <= 0)
    simpleError("roomCubicMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.targetRt60Seconds) || x.targetRt60Seconds <= 0)
    simpleError("targetRt60Seconds", "Provide a finite positive number.");
  const absorptionSabins = (0.161 * x.roomCubicMeters) / x.targetRt60Seconds;
  if (!Number.isFinite(absorptionSabins))
    simpleError(
      "absorptionSabins",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    absorptionSabins: Object.is(absorptionSabins, -0) ? 0 : absorptionSabins,
  };
};

export const example = {
  input: {
    roomCubicMeters: 100,
    targetRt60Seconds: 1,
  },
  output: { absorptionSabins: 16.1 },
} satisfies ToolExample<
  AbsorptionRequiredForTargetRtInput,
  AbsorptionRequiredForTargetRtOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/absorption-required-for-target-rt",
  title: "Absorption Required For Target Rt",
  description:
    "Metric Sabine equivalent absorption area required for a target RT60: 0.161V/T.",
  inputs: [
    {
      id: "roomCubicMeters",
      kind: "number",
      label: "Room Cubic Meters",
      unit: "m3",
      minimum: 0,
    },
    {
      id: "targetRt60Seconds",
      kind: "number",
      label: "Target Rt 60 Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "absorptionSabins",
      kind: "number",
      label: "Absorption Sabins",
      unit: "m2",
    },
  ],
  calculate: (input) =>
    calculateAbsorptionRequiredForTargetRt({
      roomCubicMeters: input.roomCubicMeters as number,
      targetRt60Seconds: input.targetRt60Seconds as number,
    }),
});
export const absorptionRequiredForTargetRtTool = tool;
export const runAbsorptionRequiredForTargetRt = tool.execute;
export default tool;
