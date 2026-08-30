import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly averagePowerMilliwatts: number;
  readonly pulseWidthMilliseconds: number;
  readonly pulseRateHertz: number;
  readonly exposureSeconds: number;
  readonly illuminatedAreaMm2: number;
}>;
export type Output = Readonly<{
  readonly dutyCycle: number;
  readonly deliveredEnergyJoules: number;
  readonly radiantDoseJPerCm2: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.illuminatedAreaMm2 <= 0)
    simpleError(
      "illuminatedAreaMm2",
      "Illuminated area must be positive.",
      "invalid_area",
    );
  const dutyCycle =
    (input.pulseWidthMilliseconds / 1000) * input.pulseRateHertz;
  const deliveredEnergyJoules =
    (input.averagePowerMilliwatts / 1000) * dutyCycle * input.exposureSeconds;
  return {
    dutyCycle,
    deliveredEnergyJoules,
    radiantDoseJPerCm2:
      deliveredEnergyJoules / (input.illuminatedAreaMm2 / 100),
  };
};

export const exampleInput = {
  averagePowerMilliwatts: 10,
  pulseWidthMilliseconds: 10,
  pulseRateHertz: 10,
  exposureSeconds: 10,
  illuminatedAreaMm2: 1,
} satisfies Input;
export const exampleOutput = {
  dutyCycle: 0.1,
  deliveredEnergyJoules: 0.01,
  radiantDoseJPerCm2: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      averagePowerMilliwatts: input.averagePowerMilliwatts as number,
      pulseWidthMilliseconds: input.pulseWidthMilliseconds as number,
      pulseRateHertz: input.pulseRateHertz as number,
      exposureSeconds: input.exposureSeconds as number,
      illuminatedAreaMm2: input.illuminatedAreaMm2 as number,
    }),
  description:
    "Calculate pulsed optogenetic duty cycle, delivered energy, and radiant dose.",
  id: "laser/optogenetic-pulse-dose",
  inputs: [
    {
      id: "averagePowerMilliwatts",
      label: "Average optical power",
      kind: "number",
      minimum: 0,
      unit: "mW",
    },
    {
      id: "pulseWidthMilliseconds",
      label: "Pulse width",
      kind: "number",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "pulseRateHertz",
      label: "Pulse rate",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "exposureSeconds",
      label: "Exposure duration",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "illuminatedAreaMm2",
      label: "Illuminated area",
      kind: "number",
      minimum: 0,
      unit: "mm²",
    },
  ],
  outputs: [
    { id: "dutyCycle", label: "Pulse duty cycle", kind: "number", minimum: 0 },
    {
      id: "deliveredEnergyJoules",
      label: "Delivered optical energy",
      kind: "number",
      minimum: 0,
      unit: "J",
    },
    {
      id: "radiantDoseJPerCm2",
      label: "Radiant dose",
      kind: "number",
      minimum: 0,
      unit: "J/cm²",
    },
  ],
  title: "Optogenetic Pulse Dose",
});

export const run = tool.execute;
export default tool;
