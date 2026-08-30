import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly consumedFuelDryTonnes: readonly number[];
  readonly pm25EmissionFactorsGramsPerKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalPm25EmissionKg: number;
  readonly consumedFuelWeightedEmissionKgPerTonne: number;
}>;
const inputFields = [
  {
    id: "consumedFuelDryTonnes",
    label: "Consumed fuel dry tonnes",
    kind: "numberList",
  },
  {
    id: "pm25EmissionFactorsGramsPerKg",
    label: "Pm25 emission factors grams per kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.consumedFuelDryTonnes.forEach((v) =>
    nonnegative(v, "consumedFuelDryTonnes"),
  );
  input.pm25EmissionFactorsGramsPerKg.forEach((v) =>
    nonnegative(v, "pm25EmissionFactorsGramsPerKg"),
  );
  aligned(
    input.consumedFuelDryTonnes,
    input.pm25EmissionFactorsGramsPerKg,
    "consumedFuelDryTonnes",
  );
  const totalFuel = positive(
      input.consumedFuelDryTonnes.reduce((a, b) => a + b, 0),
      "consumedFuelDryTonnes",
    ),
    totalPm25EmissionKg = input.consumedFuelDryTonnes.reduce(
      (s, v, i) => s + v * input.pm25EmissionFactorsGramsPerKg[i],
      0,
    );
  return {
    totalPm25EmissionKg,
    consumedFuelWeightedEmissionKgPerTonne: totalPm25EmissionKg / totalFuel,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  consumedFuelDryTonnes: [1, 2],
  pm25EmissionFactorsGramsPerKg: [10, 20],
} satisfies Input;
export const exampleOutput = {
  totalPm25EmissionKg: 50,
  consumedFuelWeightedEmissionKgPerTonne: 16.666666666666668,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/smoke-emission-pm25-per-ton-burned",
  title: "PM2.5 Smoke Emission Per Ton Burned",
  description:
    "Aggregate distinct measured consumed dry fuel classes and caller PM2.5 mass emission factors; grams/kg equals kg/tonne, and emitted mass is not dispersion, exposure or air-quality safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalPm25EmissionKg",
      label: "Total pm25 emission kg",
      kind: "number",
    },
    {
      id: "consumedFuelWeightedEmissionKgPerTonne",
      label: "Consumed fuel weighted emission kg per tonne",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      consumedFuelDryTonnes: value.consumedFuelDryTonnes as readonly number[],
      pm25EmissionFactorsGramsPerKg:
        value.pm25EmissionFactorsGramsPerKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
