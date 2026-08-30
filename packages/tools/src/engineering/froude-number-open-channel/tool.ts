import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FroudeNumberOpenChannelInput = Readonly<{
  readonly speedMetersPerSecond: number;
  readonly hydraulicDepthMeters: number;
  readonly gravityMetersPerSecondSquared: number;
}>;
export type FroudeNumberOpenChannelOutput = Readonly<{
  readonly froudeNumber: number;
}>;

export const calculateFroudeNumberOpenChannel = (
  x: FroudeNumberOpenChannelInput,
): FroudeNumberOpenChannelOutput => {
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.hydraulicDepthMeters) || x.hydraulicDepthMeters < 0)
    simpleError("hydraulicDepthMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared < 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  const froudeNumber =
    x.speedMetersPerSecond /
    Math.sqrt(x.gravityMetersPerSecondSquared * x.hydraulicDepthMeters);
  if (!Number.isFinite(froudeNumber))
    simpleError(
      "froudeNumber",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { froudeNumber: Object.is(froudeNumber, -0) ? 0 : froudeNumber };
};

export const example = {
  input: {
    speedMetersPerSecond: 2,
    hydraulicDepthMeters: 1,
    gravityMetersPerSecondSquared: 9.81,
  },
  output: { froudeNumber: 0.638550856814101 },
} satisfies ToolExample<
  FroudeNumberOpenChannelInput,
  FroudeNumberOpenChannelOutput
>;

export const tool = createSimpleTool({
  id: "engineering/froude-number-open-channel",
  title: "Froude Number Open Channel",
  description:
    "Open-channel Froude number v/√(gD), where D is hydraulic depth.",
  inputs: [
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "hydraulicDepthMeters",
      kind: "number",
      label: "Hydraulic Depth Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "gravityMetersPerSecondSquared",
      kind: "number",
      label: "Gravity Meters Per Second Squared",
      unit: "m/s²",
      minimum: 0,
    },
  ],
  outputs: [{ id: "froudeNumber", kind: "number", label: "Froude Number" }],
  calculate: (input) =>
    calculateFroudeNumberOpenChannel({
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      hydraulicDepthMeters: input.hydraulicDepthMeters as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
    }),
});
export const froudeNumberOpenChannelTool = tool;
export const runFroudeNumberOpenChannel = tool.execute;
export default tool;
