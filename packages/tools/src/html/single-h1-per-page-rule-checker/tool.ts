import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{ readonly observedH1Count: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "observedH1Count", label: "Observed h1 count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.observedH1Count, "count", 0, 1000000);
  return { matchesCallerOneH1Rule: i.observedH1Count === 1 };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { observedH1Count: 1 },
  output: { result: { matchesCallerOneH1Rule: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/single-h1-per-page-rule-checker",
  title: "Single h1 Per Page Rule Check",
  description:
    "Explicit caller observed h1 count against a one-h1 style rule; not a HTML parsing, standard validity or accessibility certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { matchesCallerOneH1Rule: { type: "boolean" } },
        required: ["matchesCallerOneH1Rule"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
