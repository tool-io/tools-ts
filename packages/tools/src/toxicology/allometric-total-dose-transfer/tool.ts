import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly sourceDoseMgPerKg: number;
  readonly sourceMassKg: number;
  readonly targetMassKg: number;
  readonly totalDoseMassExponent: number;
}>;
export type Output = Readonly<{
  readonly targetDoseMgPerKg: number;
  readonly targetTotalDoseMg: number;
}>;
const inputFields = [
  {
    id: "sourceDoseMgPerKg",
    label: "Source dose mg per kg",
    kind: "number",
    unit: "kg",
  },
  { id: "sourceMassKg", label: "Source mass kg", kind: "number", unit: "kg" },
  { id: "targetMassKg", label: "Target mass kg", kind: "number", unit: "kg" },
  {
    id: "totalDoseMassExponent",
    label: "Total dose mass exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.sourceDoseMgPerKg, "sourceDoseMgPerKg");
  positive(input.sourceMassKg, "sourceMassKg");
  positive(input.targetMassKg, "targetMassKg");
  fraction(input.totalDoseMassExponent, "totalDoseMassExponent");
  const targetTotalDoseMg =
    input.sourceDoseMgPerKg *
    input.sourceMassKg *
    (input.targetMassKg / input.sourceMassKg) ** input.totalDoseMassExponent;
  return {
    targetDoseMgPerKg: targetTotalDoseMg / input.targetMassKg,
    targetTotalDoseMg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sourceDoseMgPerKg: 10,
  sourceMassKg: 1,
  targetMassKg: 16,
  totalDoseMassExponent: 0.75,
} satisfies Input;
export const exampleOutput = {
  targetDoseMgPerKg: 5,
  targetTotalDoseMg: 80,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/allometric-total-dose-transfer",
  title: "Allometric Scaling Dose",
  description:
    "Scale total dose with a supplied mass exponent and recover mass-normalized target dose; species kinetics and human dosing suitability are not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "targetDoseMgPerKg",
      label: "Target dose mg per kg",
      kind: "number",
      unit: "kg",
    },
    { id: "targetTotalDoseMg", label: "Target total dose mg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sourceDoseMgPerKg: value.sourceDoseMgPerKg as number,
      sourceMassKg: value.sourceMassKg as number,
      targetMassKg: value.targetMassKg as number,
      totalDoseMassExponent: value.totalDoseMassExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
