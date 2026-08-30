import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly translationSpeedMmPerSecond: number;
  readonly pulseRateHertz: number;
  readonly modifiedZoneDiameterMicrometers: number;
}>;
export type Output = Readonly<{
  readonly pulseSpacingMicrometers: number;
  readonly pulsesPerModifiedZone: number;
  readonly linearOverlapPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.pulseRateHertz <= 0 || input.modifiedZoneDiameterMicrometers <= 0)
    simpleError(
      "pulseRateHertz",
      "Pulse rate and modified-zone diameter must be positive.",
      "invalid_scan",
    );
  const pulseSpacingMicrometers =
    (input.translationSpeedMmPerSecond * 1000) / input.pulseRateHertz;
  return {
    pulseSpacingMicrometers,
    pulsesPerModifiedZone:
      input.modifiedZoneDiameterMicrometers / pulseSpacingMicrometers,
    linearOverlapPercent:
      (1 - pulseSpacingMicrometers / input.modifiedZoneDiameterMicrometers) *
      100,
  };
};

export const exampleInput = {
  translationSpeedMmPerSecond: 1,
  pulseRateHertz: 1000,
  modifiedZoneDiameterMicrometers: 2,
} satisfies Input;
export const exampleOutput = {
  pulseSpacingMicrometers: 1,
  pulsesPerModifiedZone: 2,
  linearOverlapPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      translationSpeedMmPerSecond: input.translationSpeedMmPerSecond as number,
      pulseRateHertz: input.pulseRateHertz as number,
      modifiedZoneDiameterMicrometers:
        input.modifiedZoneDiameterMicrometers as number,
    }),
  description:
    "Calculate stealth-dicing pulse spacing, overlap, and pulse density.",
  id: "laser/stealth-dicing-pulse-spacing",
  inputs: [
    {
      id: "translationSpeedMmPerSecond",
      label: "Translation speed",
      kind: "number",
      minimum: 0,
      unit: "mm/s",
    },
    {
      id: "pulseRateHertz",
      label: "Pulse rate",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "modifiedZoneDiameterMicrometers",
      label: "Modified-zone diameter",
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
      id: "pulsesPerModifiedZone",
      label: "Pulses per modified-zone diameter",
      kind: "number",
      minimum: 0,
    },
    {
      id: "linearOverlapPercent",
      label: "Linear overlap",
      kind: "number",
      unit: "%",
    },
  ],
  title: "Stealth-Dicing Pulse Spacing",
});

export const run = tool.execute;
export default tool;
