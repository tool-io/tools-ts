import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StandingWaveNodeSpacingInput = Readonly<{
  readonly wavelengthMeters: number;
}>;
export type StandingWaveNodeSpacingOutput = Readonly<{
  readonly nodeSpacingMeters: number;
}>;

export const calculateStandingWaveNodeSpacing = (
  x: StandingWaveNodeSpacingInput,
): StandingWaveNodeSpacingOutput => {
  if (!Number.isFinite(x.wavelengthMeters) || x.wavelengthMeters <= 0)
    simpleError("wavelengthMeters", "Provide a finite positive number.");
  const nodeSpacingMeters = x.wavelengthMeters / 2;
  if (!Number.isFinite(nodeSpacingMeters))
    simpleError(
      "nodeSpacingMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    nodeSpacingMeters: Object.is(nodeSpacingMeters, -0) ? 0 : nodeSpacingMeters,
  };
};

export const example = {
  input: {
    wavelengthMeters: 1,
  },
  output: { nodeSpacingMeters: 0.5 },
} satisfies ToolExample<
  StandingWaveNodeSpacingInput,
  StandingWaveNodeSpacingOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/standing-wave-node-spacing",
  title: "Standing Wave Node Spacing",
  description:
    "Distance between adjacent nodes of a standing wave from its wavelength.",
  inputs: [
    {
      id: "wavelengthMeters",
      kind: "number",
      label: "Wavelength Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "nodeSpacingMeters",
      kind: "number",
      label: "Node Spacing Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateStandingWaveNodeSpacing({
      wavelengthMeters: input.wavelengthMeters as number,
    }),
});
export const standingWaveNodeSpacingTool = tool;
export const runStandingWaveNodeSpacing = tool.execute;
export default tool;
