import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualTestAuc: number;
  readonly actualTestDoseMass: number;
  readonly actualReferenceAuc: number;
  readonly actualReferenceDoseMass: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualTestAuc", label: "Actual test auc", kind: "number" },
  { id: "actualTestDoseMass", label: "Actual test dose mass", kind: "number" },
  { id: "actualReferenceAuc", label: "Actual reference auc", kind: "number" },
  {
    id: "actualReferenceDoseMass",
    label: "Actual reference dose mass",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualTestAuc, "actualTestAuc");
  positive(input.actualTestDoseMass, "actualTestDoseMass");
  positive(input.actualReferenceAuc, "actualReferenceAuc");
  positive(input.actualReferenceDoseMass, "actualReferenceDoseMass");
  return {
    value:
      input.actualTestAuc /
      input.actualTestDoseMass /
      (input.actualReferenceAuc / input.actualReferenceDoseMass),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTestAuc: 2,
    actualTestDoseMass: 2,
    actualReferenceAuc: 4,
    actualReferenceDoseMass: 2,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/bioavailability-relative",
  title: "Relative Bioavailability Calculator",
  description:
    "Relative dose-normalized bioavailability against actual SAME route reference formulation, not absolute IV bioavailability. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
