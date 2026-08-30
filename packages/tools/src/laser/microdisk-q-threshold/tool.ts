import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly resonanceWavelengthMeters: number;
  readonly linewidthMeters: number;
  readonly groupIndex: number;
  readonly confinementFactor: number;
  readonly availableMaterialGainPerMeter: number;
}>;
export type Output = Readonly<{
  readonly qualityFactor: number;
  readonly thresholdMaterialGainPerMeter: number;
  readonly aboveThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.linewidthMeters <= 0 ||
    input.resonanceWavelengthMeters <= 0 ||
    input.groupIndex <= 0 ||
    input.confinementFactor <= 0
  )
    simpleError(
      "linewidthMeters",
      "Optical values and confinement must be positive.",
      "invalid_cavity",
    );
  const qualityFactor = input.resonanceWavelengthMeters / input.linewidthMeters;
  const thresholdMaterialGainPerMeter =
    (2 * Math.PI * input.groupIndex) /
    (qualityFactor * input.resonanceWavelengthMeters * input.confinementFactor);
  return {
    qualityFactor,
    thresholdMaterialGainPerMeter,
    aboveThreshold:
      input.availableMaterialGainPerMeter >= thresholdMaterialGainPerMeter,
  };
};

export const exampleInput = {
  resonanceWavelengthMeters: 1e-6,
  linewidthMeters: 1e-10,
  groupIndex: 2,
  confinementFactor: 0.5,
  availableMaterialGainPerMeter: 3000,
} satisfies Input;
export const exampleOutput = {
  qualityFactor: 10000,
  thresholdMaterialGainPerMeter: 2513.2741228718346,
  aboveThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      resonanceWavelengthMeters: input.resonanceWavelengthMeters as number,
      linewidthMeters: input.linewidthMeters as number,
      groupIndex: input.groupIndex as number,
      confinementFactor: input.confinementFactor as number,
      availableMaterialGainPerMeter:
        input.availableMaterialGainPerMeter as number,
    }),
  description:
    "Derive microdisk loaded Q and threshold material gain, then compare available gain.",
  id: "laser/microdisk-q-threshold",
  inputs: [
    {
      id: "resonanceWavelengthMeters",
      label: "Resonance wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "linewidthMeters",
      label: "Resonance linewidth",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    { id: "groupIndex", label: "Group index", kind: "number", minimum: 0 },
    {
      id: "confinementFactor",
      label: "Modal confinement factor",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "availableMaterialGainPerMeter",
      label: "Available material gain",
      kind: "number",
      minimum: 0,
      unit: "1/m",
    },
  ],
  outputs: [
    {
      id: "qualityFactor",
      label: "Loaded quality factor",
      kind: "number",
      minimum: 0,
    },
    {
      id: "thresholdMaterialGainPerMeter",
      label: "Threshold material gain",
      kind: "number",
      minimum: 0,
      unit: "1/m",
    },
    {
      id: "aboveThreshold",
      label: "Available gain exceeds threshold",
      kind: "boolean",
    },
  ],
  title: "Microdisk Q Threshold",
});

export const run = tool.execute;
export default tool;
