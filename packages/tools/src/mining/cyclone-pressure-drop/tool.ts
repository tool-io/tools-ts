import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly slurryDensityKgPerM3: number;
  readonly inletVelocityMPerSecond: number;
  readonly calibratedLossCoefficient: number;
}>;
export type Output = Readonly<{ readonly predictedPressureDropPa: number }>;
const inputFields = [
  {
    id: "slurryDensityKgPerM3",
    label: "Slurry density kg per m3",
    kind: "number",
  },
  {
    id: "inletVelocityMPerSecond",
    label: "Inlet velocity m per second",
    kind: "number",
  },
  {
    id: "calibratedLossCoefficient",
    label: "Calibrated loss coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.slurryDensityKgPerM3, "slurryDensityKgPerM3");
  nonnegative(input.inletVelocityMPerSecond, "inletVelocityMPerSecond");
  nonnegative(input.calibratedLossCoefficient, "calibratedLossCoefficient");
  return {
    predictedPressureDropPa:
      0.5 *
      input.calibratedLossCoefficient *
      input.slurryDensityKgPerM3 *
      input.inletVelocityMPerSecond ** 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  slurryDensityKgPerM3: 1500,
  inletVelocityMPerSecond: 4,
  calibratedLossCoefficient: 2,
} satisfies Input;
export const exampleOutput = {
  predictedPressureDropPa: 24000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/cyclone-pressure-drop",
  title: "Cyclone Pressure Drop",
  description:
    "Estimate hydrocyclone inlet pressure loss with caller-calibrated dynamic-head coefficient; no universal geometry correlation.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedPressureDropPa",
      label: "Predicted pressure drop pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      slurryDensityKgPerM3: value.slurryDensityKgPerM3 as number,
      inletVelocityMPerSecond: value.inletVelocityMPerSecond as number,
      calibratedLossCoefficient: value.calibratedLossCoefficient as number,
    }),
});
export const run = tool.execute;
export default tool;
