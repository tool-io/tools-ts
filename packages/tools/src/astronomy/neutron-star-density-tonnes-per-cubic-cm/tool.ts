import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly massKg: number;
  readonly radiusKm: number;
}>;
export type Output = Readonly<{ readonly meanDensityTonnesPerCubicCm: number }>;
const inputFields = [
  { id: "massKg", label: "Mass kg", kind: "number" },
  { id: "radiusKm", label: "Radius km", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.radiusKm, "radiusKm");
  nonnegative(input.massKg, "massKg");
  return {
    meanDensityTonnesPerCubicCm:
      input.massKg / (((4 * Math.PI) / 3) * (input.radiusKm * 1000) ** 3) / 1e9,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  massKg: 4188790204786.3906,
  radiusKm: 1,
} satisfies Input;
export const exampleOutput = {
  meanDensityTonnesPerCubicCm: 0.000001,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/neutron-star-density-tonnes-per-cubic-cm",
  title: "Neutron Star Density t/cm³ Estimate",
  description:
    "Spherical mean density,1 tonne/cm³=10^9 kg/m³, not neutron-star equation of state. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "meanDensityTonnesPerCubicCm",
      label: "Mean density tonnes per cubic cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      massKg: value.massKg as number,
      radiusKm: value.radiusKm as number,
    }),
});
export const run = tool.execute;
export default tool;
