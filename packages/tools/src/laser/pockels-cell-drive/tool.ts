import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly driveVoltageVolts: number;
  readonly halfWaveVoltageVolts: number;
}>;
export type Output = Readonly<{
  readonly retardationRadians: number;
  readonly crossedPolarizerTransmission: number;
  readonly halfWaveFraction: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.halfWaveVoltageVolts <= 0)
    simpleError(
      "halfWaveVoltageVolts",
      "Half-wave voltage must be positive.",
      "invalid_voltage",
    );
  const halfWaveFraction = input.driveVoltageVolts / input.halfWaveVoltageVolts;
  const retardationRadians = Math.PI * halfWaveFraction;
  return {
    retardationRadians,
    crossedPolarizerTransmission: Math.sin(retardationRadians / 2) ** 2,
    halfWaveFraction,
  };
};

export const exampleInput = {
  driveVoltageVolts: 1,
  halfWaveVoltageVolts: 2,
} satisfies Input;
export const exampleOutput = {
  retardationRadians: 1.5707963267948966,
  crossedPolarizerTransmission: 0.4999999999999999,
  halfWaveFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      driveVoltageVolts: input.driveVoltageVolts as number,
      halfWaveVoltageVolts: input.halfWaveVoltageVolts as number,
    }),
  description:
    "Calculate Pockels-cell retardation and ideal crossed-polarizer transmission.",
  id: "laser/pockels-cell-drive",
  inputs: [
    {
      id: "driveVoltageVolts",
      label: "Applied drive voltage",
      kind: "number",
      unit: "V",
    },
    {
      id: "halfWaveVoltageVolts",
      label: "Half-wave voltage",
      kind: "number",
      minimum: 0,
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "retardationRadians",
      label: "Electro-optic retardation",
      kind: "number",
      unit: "rad",
    },
    {
      id: "crossedPolarizerTransmission",
      label: "Ideal crossed-polarizer transmission",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "halfWaveFraction",
      label: "Drive as a fraction of half-wave voltage",
      kind: "number",
    },
  ],
  title: "Pockels-Cell Drive",
});

export const run = tool.execute;
export default tool;
