import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly opticalPowerWatts: number;
  readonly exposureSeconds: number;
  readonly treatedAreaCm2: number;
}>;
export type Output = Readonly<{
  readonly deliveredEnergyJoules: number;
  readonly fluenceJPerCm2: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.treatedAreaCm2 <= 0)
    simpleError(
      "treatedAreaCm2",
      "Treated area must be positive.",
      "invalid_area",
    );
  const deliveredEnergyJoules = input.opticalPowerWatts * input.exposureSeconds;
  return {
    deliveredEnergyJoules,
    fluenceJPerCm2: deliveredEnergyJoules / input.treatedAreaCm2,
  };
};

export const exampleInput = {
  opticalPowerWatts: 2,
  exposureSeconds: 5,
  treatedAreaCm2: 10,
} satisfies Input;
export const exampleOutput = {
  deliveredEnergyJoules: 10,
  fluenceJPerCm2: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      opticalPowerWatts: input.opticalPowerWatts as number,
      exposureSeconds: input.exposureSeconds as number,
      treatedAreaCm2: input.treatedAreaCm2 as number,
    }),
  description: "Calculate delivered energy and fluence for photobiomodulation.",
  id: "laser/photobiomodulation-dose",
  inputs: [
    {
      id: "opticalPowerWatts",
      label: "Optical power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "exposureSeconds",
      label: "Exposure duration",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "treatedAreaCm2",
      label: "Treated area",
      kind: "number",
      minimum: 0,
      unit: "cm²",
    },
  ],
  outputs: [
    {
      id: "deliveredEnergyJoules",
      label: "Delivered energy",
      kind: "number",
      minimum: 0,
      unit: "J",
    },
    {
      id: "fluenceJPerCm2",
      label: "Photobiomodulation fluence",
      kind: "number",
      minimum: 0,
      unit: "J/cm²",
    },
  ],
  title: "Photobiomodulation Dose",
});

export const run = tool.execute;
export default tool;
