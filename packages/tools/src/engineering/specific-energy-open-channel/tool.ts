import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpecificEnergyOpenChannelInput = Readonly<{
  readonly depthMeters: number;
  readonly speedMetersPerSecond: number;
  readonly gravityMetersPerSecondSquared: number;
}>;
export type SpecificEnergyOpenChannelOutput = Readonly<{
  readonly specificEnergyMeters: number;
}>;

export const calculateSpecificEnergyOpenChannel = (
  x: SpecificEnergyOpenChannelInput,
): SpecificEnergyOpenChannelOutput => {
  if (!Number.isFinite(x.depthMeters) || x.depthMeters < 0)
    simpleError("depthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared < 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  const specificEnergyMeters =
    x.depthMeters +
    x.speedMetersPerSecond ** 2 / (2 * x.gravityMetersPerSecondSquared);
  if (!Number.isFinite(specificEnergyMeters))
    simpleError(
      "specificEnergyMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    specificEnergyMeters: Object.is(specificEnergyMeters, -0)
      ? 0
      : specificEnergyMeters,
  };
};

export const example = {
  input: {
    depthMeters: 2,
    speedMetersPerSecond: 3,
    gravityMetersPerSecondSquared: 9.81,
  },
  output: { specificEnergyMeters: 2.458715596330275 },
} satisfies ToolExample<
  SpecificEnergyOpenChannelInput,
  SpecificEnergyOpenChannelOutput
>;

export const tool = createSimpleTool({
  id: "engineering/specific-energy-open-channel",
  title: "Specific Energy Open Channel",
  description:
    "Open-channel specific energy above the bed E=y+v²/(2g) for uniform velocity over the section.",
  inputs: [
    {
      id: "depthMeters",
      kind: "number",
      label: "Depth Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
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
  outputs: [
    {
      id: "specificEnergyMeters",
      kind: "number",
      label: "Specific Energy Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateSpecificEnergyOpenChannel({
      depthMeters: input.depthMeters as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
    }),
});
export const specificEnergyOpenChannelTool = tool;
export const runSpecificEnergyOpenChannel = tool.execute;
export default tool;
