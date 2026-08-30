import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly stageSpeedMicrometersPerSecond: number;
  readonly pulseRateHertz: number;
  readonly spotDiameterMicrometers: number;
}>;
export type Output = Readonly<{
  readonly pulseSpacingMicrometers: number;
  readonly linearOverlapPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.pulseRateHertz <= 0 || input.spotDiameterMicrometers <= 0)
    simpleError(
      "pulseRateHertz",
      "Pulse rate and spot diameter must be positive.",
      "invalid_scan",
    );
  const pulseSpacingMicrometers =
    input.stageSpeedMicrometersPerSecond / input.pulseRateHertz;
  return {
    pulseSpacingMicrometers,
    linearOverlapPercent:
      (1 - pulseSpacingMicrometers / input.spotDiameterMicrometers) * 100,
  };
};

export const exampleInput = {
  stageSpeedMicrometersPerSecond: 1000,
  pulseRateHertz: 1000,
  spotDiameterMicrometers: 2,
} satisfies Input;
export const exampleOutput = {
  pulseSpacingMicrometers: 1,
  linearOverlapPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      stageSpeedMicrometersPerSecond:
        input.stageSpeedMicrometersPerSecond as number,
      pulseRateHertz: input.pulseRateHertz as number,
      spotDiameterMicrometers: input.spotDiameterMicrometers as number,
    }),
  description:
    "Calculate pulse spacing and linear overlap for laser microdissection.",
  id: "laser/microdissection-pulse-overlap",
  inputs: [
    {
      id: "stageSpeedMicrometersPerSecond",
      label: "Stage speed",
      kind: "number",
      minimum: 0,
      unit: "µm/s",
    },
    {
      id: "pulseRateHertz",
      label: "Pulse rate",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "spotDiameterMicrometers",
      label: "Spot diameter",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
  ],
  outputs: [
    {
      id: "pulseSpacingMicrometers",
      label: "Pulse spacing",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
    {
      id: "linearOverlapPercent",
      label: "Linear pulse overlap",
      kind: "number",
      unit: "%",
    },
  ],
  title: "Microdissection Pulse Overlap",
});

export const run = tool.execute;
export default tool;
