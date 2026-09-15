import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch53-shared.js";

export type Input = Readonly<{ neutralMassDa: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "neutralMassDa", label: "Neutral mass da", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(i.neutralMassDa, "mass");
  return { singlyProtonatedMz: i.neutralMassDa + 1.007276466621 };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { neutralMassDa: 100 },
  output: { result: { singlyProtonatedMz: 101.007276466621 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protonated-peptide-mass-calculator",
  title: "Protonated Peptide M-plus-H Mass Calculator",
  description:
    "Add the proton mass for an independently established singly protonated neutral peptide; not a sodium adduct or a multiply charged m/z.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
