import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly concentrationsMgPerCubicMeter: readonly number[];
  readonly ventilationCubicMetersPerHour: readonly number[];
  readonly exposureHours: readonly number[];
  readonly retainedFractions: readonly number[];
  readonly bodyMassKg: number;
}>;
export type Output = Readonly<{
  readonly retainedMassesMg: readonly number[];
  readonly retainedDoseMgPerKg: number;
}>;
const inputFields = [
  {
    id: "concentrationsMgPerCubicMeter",
    label: "Concentrations mg per cubic meter",
    kind: "numberList",
  },
  {
    id: "ventilationCubicMetersPerHour",
    label: "Ventilation cubic meters per hour",
    kind: "numberList",
  },
  { id: "exposureHours", label: "Exposure hours", kind: "numberList" },
  { id: "retainedFractions", label: "Retained fractions", kind: "numberList" },
  { id: "bodyMassKg", label: "Body mass kg", kind: "number", unit: "kg" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.concentrationsMgPerCubicMeter,
    input.ventilationCubicMetersPerHour,
    "concentrationsMgPerCubicMeter",
  );
  aligned(
    input.concentrationsMgPerCubicMeter,
    input.exposureHours,
    "concentrationsMgPerCubicMeter",
  );
  aligned(
    input.concentrationsMgPerCubicMeter,
    input.retainedFractions,
    "concentrationsMgPerCubicMeter",
  );
  input.concentrationsMgPerCubicMeter.forEach((v) =>
    nonnegative(v, "concentrationsMgPerCubicMeter"),
  );
  input.ventilationCubicMetersPerHour.forEach((v) =>
    nonnegative(v, "ventilationCubicMetersPerHour"),
  );
  input.exposureHours.forEach((v) => nonnegative(v, "exposureHours"));
  input.retainedFractions.forEach((v) => fraction(v, "retainedFractions"));
  positive(input.bodyMassKg, "bodyMassKg");
  const retainedMassesMg = input.concentrationsMgPerCubicMeter.map(
    (v, i) =>
      v *
      input.ventilationCubicMetersPerHour[i] *
      input.exposureHours[i] *
      input.retainedFractions[i],
  );
  return {
    retainedMassesMg,
    retainedDoseMgPerKg:
      retainedMassesMg.reduce((a, b) => a + b, 0) / input.bodyMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  concentrationsMgPerCubicMeter: [1, 2],
  ventilationCubicMetersPerHour: [1, 0.5],
  exposureHours: [2, 2],
  retainedFractions: [0.5, 0.5],
  bodyMassKg: 50,
} satisfies Input;
export const exampleOutput = {
  retainedMassesMg: [1, 1],
  retainedDoseMgPerKg: 0.04,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/interval-inhalation-retained-dose",
  title: "Inhalation Dose",
  description:
    "Integrate retained inhaled mass across measured concentration/ventilation/exposure intervals; respiratory deposition fractions are supplied, not inferred from particle size.",
  inputs: inputFields,
  outputs: [
    { id: "retainedMassesMg", label: "Retained masses mg", kind: "numberList" },
    {
      id: "retainedDoseMgPerKg",
      label: "Retained dose mg per kg",
      kind: "number",
      unit: "kg",
    },
  ],
  calculate: (value) =>
    calculate({
      concentrationsMgPerCubicMeter:
        value.concentrationsMgPerCubicMeter as readonly number[],
      ventilationCubicMetersPerHour:
        value.ventilationCubicMetersPerHour as readonly number[],
      exposureHours: value.exposureHours as readonly number[],
      retainedFractions: value.retainedFractions as readonly number[],
      bodyMassKg: value.bodyMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;
