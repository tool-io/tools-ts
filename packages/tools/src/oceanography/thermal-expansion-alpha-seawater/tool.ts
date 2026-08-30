import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, ordered } from "../shared.js";
export type Input = Readonly<{
  readonly bracketTemperaturesC: readonly number[];
  readonly bracketDensitiesKgPerM3: readonly number[];
  readonly referenceDensityKgPerM3: number;
}>;
export type Output = Readonly<{ readonly estimatedExpansionPerKelvin: number }>;
const inputFields = [
  {
    id: "bracketTemperaturesC",
    label: "Bracket temperatures c",
    kind: "numberList",
  },
  {
    id: "bracketDensitiesKgPerM3",
    label: "Bracket densities kg per m3",
    kind: "numberList",
  },
  {
    id: "referenceDensityKgPerM3",
    label: "Reference density kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.bracketDensitiesKgPerM3.forEach((v) =>
    positive(v, "bracketDensitiesKgPerM3"),
  );
  positive(input.referenceDensityKgPerM3, "referenceDensityKgPerM3");
  if (
    input.bracketTemperaturesC.length !== 2 ||
    input.bracketDensitiesKgPerM3.length !== 2
  )
    simpleError(
      "bracketTemperaturesC",
      "Exactly two fixed-salinity/fixed-pressure bracket states required.",
    );
  ordered(input.bracketTemperaturesC, "bracketTemperaturesC");
  return {
    estimatedExpansionPerKelvin:
      -(input.bracketDensitiesKgPerM3[1] - input.bracketDensitiesKgPerM3[0]) /
      (input.bracketTemperaturesC[1] - input.bracketTemperaturesC[0]) /
      input.referenceDensityKgPerM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bracketTemperaturesC: [10, 20],
  bracketDensitiesKgPerM3: [1000, 998],
  referenceDensityKgPerM3: 999,
} satisfies Input;
export const exampleOutput = {
  estimatedExpansionPerKelvin: 0.0002002002002002002,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/thermal-expansion-alpha-seawater",
  title: "Thermal Expansion Alpha Seawater",
  description:
    "Estimate signed thermal expansion from measured density-temperature brackets at fixed salinity/pressure; not a reference-property lookup or a universal seawater coefficient.",
  inputs: inputFields,
  outputs: [
    {
      id: "estimatedExpansionPerKelvin",
      label: "Estimated expansion per kelvin",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      bracketTemperaturesC: value.bracketTemperaturesC as readonly number[],
      bracketDensitiesKgPerM3:
        value.bracketDensitiesKgPerM3 as readonly number[],
      referenceDensityKgPerM3: value.referenceDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
