import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Patria potestas describes historically changing legal authority of a Roman paterfamilias over persons within the relevant family status.",
        reference: "Gaius, Institutes 1.",
        limitations:
          "Not unrestricted timeless power or current law; status and era are indispensable.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Patria potestas describes historically changing legal authority of a Roman paterfamilias over persons within the relevant family status.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/paterfamilias-patria-potestas-authority-scope-lookup",
  title: "Paterfamilias Patria Potestas Authority Scope Lookup",
  description:
    "Offline bounded reference card: Patria potestas describes historically changing legal authority of a Roman paterfamilias over persons within the relevant family status. References Gaius, Institutes 1. Not unrestricted timeless power or current law; status and era are indispensable.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
