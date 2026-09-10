import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  daysBetween,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly previousIndependentlyEstimatedFetalWeightGrams: number;
  readonly currentIndependentlyEstimatedFetalWeightGrams: number;
  readonly previousScanDate: string;
  readonly currentScanDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "previousIndependentlyEstimatedFetalWeightGrams",
    label: "Previous independently estimated fetal weight grams",
    kind: "number",
  },
  {
    id: "currentIndependentlyEstimatedFetalWeightGrams",
    label: "Current independently estimated fetal weight grams",
    kind: "number",
  },
  { id: "previousScanDate", label: "Previous scan date", kind: "string" },
  { id: "currentScanDate", label: "Current scan date", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.previousIndependentlyEstimatedFetalWeightGrams, "weight");
  positive(input.currentIndependentlyEstimatedFetalWeightGrams, "weight");
  const d = positive(
      daysBetween(input.previousScanDate, input.currentScanDate),
      "scan-interval",
    ),
    v =
      input.currentIndependentlyEstimatedFetalWeightGrams -
      input.previousIndependentlyEstimatedFetalWeightGrams;
  return {
    signedEstimatedWeightChangeGrams: v,
    conditionalEstimatedGrowthGramsPerWeek: (7 * v) / d,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    previousIndependentlyEstimatedFetalWeightGrams: 1000,
    currentIndependentlyEstimatedFetalWeightGrams: 1200,
    previousScanDate: "2026-01-01",
    currentScanDate: "2026-01-15",
  },
  output: {
    result: {
      signedEstimatedWeightChangeGrams: 200,
      conditionalEstimatedGrowthGramsPerWeek: 100,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/fetal-growth-velocity",
  title: "Fetal Growth Velocity Calculator",
  description:
    "Signed difference between independently clinically dated compatible scan EFWestimates per week. Not true observed fetal-growth velocity, linear growth forecast or proof healthy/unhealthy growth; estimation uncertainty compounds.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
