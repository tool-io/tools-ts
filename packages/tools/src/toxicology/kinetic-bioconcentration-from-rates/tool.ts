import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly uptakeLitersPerKgDay: number;
  readonly eliminationPerDay: number;
  readonly growthDilutionPerDay: number;
}>;
export type Output = Readonly<{
  readonly steadyStateBcfLitersPerKg: number;
  readonly growthCorrectedBcfLitersPerKg: number;
}>;
const inputFields = [
  {
    id: "uptakeLitersPerKgDay",
    label: "Uptake liters per kg day",
    kind: "number",
  },
  { id: "eliminationPerDay", label: "Elimination per day", kind: "number" },
  {
    id: "growthDilutionPerDay",
    label: "Growth dilution per day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.uptakeLitersPerKgDay, "uptakeLitersPerKgDay");
  positive(input.eliminationPerDay, "eliminationPerDay");
  nonnegative(input.growthDilutionPerDay, "growthDilutionPerDay");
  return {
    steadyStateBcfLitersPerKg:
      input.uptakeLitersPerKgDay /
      (input.eliminationPerDay + input.growthDilutionPerDay),
    growthCorrectedBcfLitersPerKg:
      input.uptakeLitersPerKgDay / input.eliminationPerDay,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  uptakeLitersPerKgDay: 2,
  eliminationPerDay: 0.1,
  growthDilutionPerDay: 0.1,
} satisfies Input;
export const exampleOutput = {
  steadyStateBcfLitersPerKg: 10,
  growthCorrectedBcfLitersPerKg: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/kinetic-bioconcentration-from-rates",
  title: "Bioconcentration Factor",
  description:
    "Estimate kinetic BCF with and without growth dilution from externally fitted uptake/elimination rates; dietary uptake and time-varying exposure are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "steadyStateBcfLitersPerKg",
      label: "Steady state bcf liters per kg",
      kind: "number",
      unit: "kg",
    },
    {
      id: "growthCorrectedBcfLitersPerKg",
      label: "Growth corrected bcf liters per kg",
      kind: "number",
      unit: "kg",
    },
  ],
  calculate: (value) =>
    calculate({
      uptakeLitersPerKgDay: value.uptakeLitersPerKgDay as number,
      eliminationPerDay: value.eliminationPerDay as number,
      growthDilutionPerDay: value.growthDilutionPerDay as number,
    }),
});
export const run = tool.execute;
export default tool;
