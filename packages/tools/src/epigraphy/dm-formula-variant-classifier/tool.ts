import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly normalizedFormula: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "normalizedFormula", label: "Normalized formula", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.normalizedFormula,
      {
        "D M": "Dis Manibus",
        "DIS MAN": "Dis Manibus",
        "D M S": "Dis Manibus sacrum",
      },
      "normalizedFormula",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { normalizedFormula: "D M S" },
  output: { result: { reference: "Dis Manibus sacrum" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "epigraphy/dm-formula-variant-classifier",
  title: "DM Formula Variant Classifier (D M / DIS MAN / D M S)",
  description:
    "Bounded supplied Latin funerary formula expansion, not reading damaged marks or provenance/chronology identification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
