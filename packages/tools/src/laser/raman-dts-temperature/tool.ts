import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly antiStokesToStokesRatio: number;
  readonly referenceRatio: number;
  readonly referenceTemperatureKelvin: number;
  readonly ramanShiftWavenumbersPerCm: number;
}>;
export type Output = Readonly<{
  readonly temperatureKelvin: number;
  readonly temperatureChangeKelvin: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.antiStokesToStokesRatio <= 0 ||
    input.referenceRatio <= 0 ||
    input.referenceTemperatureKelvin <= 0 ||
    input.ramanShiftWavenumbersPerCm <= 0
  )
    simpleError(
      "antiStokesToStokesRatio",
      "Ratios, reference temperature, and Raman shift must be positive.",
      "invalid_calibration",
    );
  const energy =
    6.62607015e-34 * 299792458 * 100 * input.ramanShiftWavenumbersPerCm;
  const inverseTemperature =
    1 / input.referenceTemperatureKelvin -
    (1.380649e-23 / energy) *
      Math.log(input.antiStokesToStokesRatio / input.referenceRatio);
  if (inverseTemperature <= 0)
    simpleError(
      "antiStokesToStokesRatio",
      "Ratio implies a nonphysical temperature.",
      "invalid_temperature",
    );
  const temperatureKelvin = 1 / inverseTemperature;
  return {
    temperatureKelvin,
    temperatureChangeKelvin:
      temperatureKelvin - input.referenceTemperatureKelvin,
  };
};

export const exampleInput = {
  antiStokesToStokesRatio: 0.1,
  referenceRatio: 0.1,
  referenceTemperatureKelvin: 300,
  ramanShiftWavenumbersPerCm: 400,
} satisfies Input;
export const exampleOutput = {
  temperatureKelvin: 300,
  temperatureChangeKelvin: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      antiStokesToStokesRatio: input.antiStokesToStokesRatio as number,
      referenceRatio: input.referenceRatio as number,
      referenceTemperatureKelvin: input.referenceTemperatureKelvin as number,
      ramanShiftWavenumbersPerCm: input.ramanShiftWavenumbersPerCm as number,
    }),
  description:
    "Infer Raman-DTS temperature relative to a supplied ratio calibration.",
  id: "laser/raman-dts-temperature",
  inputs: [
    {
      id: "antiStokesToStokesRatio",
      label: "Measured Raman ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "referenceRatio",
      label: "Reference Raman ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "referenceTemperatureKelvin",
      label: "Reference temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    {
      id: "ramanShiftWavenumbersPerCm",
      label: "Raman shift",
      kind: "number",
      minimum: 0,
      unit: "cm⁻¹",
    },
  ],
  outputs: [
    {
      id: "temperatureKelvin",
      label: "Inferred temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    {
      id: "temperatureChangeKelvin",
      label: "Temperature change",
      kind: "number",
      unit: "K",
    },
  ],
  title: "Raman DTS Temperature",
});

export const run = tool.execute;
export default tool;
