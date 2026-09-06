import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  pick,
  bounded,
  gradeTable,
} from "../batch45-shared.js";
export type Input = Readonly<{ readonly numericGrade: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "numericGrade", label: "Numeric grade", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.numericGrade, "grade", 1, 70);
  return {
    adjectivalBand: pick(String(input.numericGrade), gradeTable, "grade"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { numericGrade: 65 },
  output: { result: { adjectivalBand: "Mint State" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/sheldon-numeric-grade-lookup",
  title: "Sheldon Numeric Grade Lookup",
  description:
    "Lookup recognized numeric wear-state grades in a bounded USS heldon-style reference, not assign a grade to a coin. Unlisted integers rejected; Mint State eligibility/strike type must be independently established.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
