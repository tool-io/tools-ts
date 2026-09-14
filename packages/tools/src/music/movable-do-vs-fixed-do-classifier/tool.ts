import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly doDefinition: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "doDefinition", label: "Do definition", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.doDefinition,
      { "tonic-relative": "movable-do", "absolute-C": "fixed-do" },
      "doDefinition",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { doDefinition: "tonic-relative" },
  output: { result: { reference: "movable-do" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/movable-do-vs-fixed-do-classifier",
  title: "Movable-Do / Fixed-Do Classifier",
  description:
    "Classify an explicitly declared solfege convention, not syllables inferred from a score.",
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
