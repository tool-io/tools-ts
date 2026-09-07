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
          "Concessio yields a limited point while retaining or reframing a larger claim.",
        reference:
          "Quintilian, Institutio Oratoria; Aristotle, Rhetoric; Silva Rhetoricae rhetorical terminology.",
        limitations:
          "A concession is not necessarily agreement with every premise.",
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
      text: "Concessio yields a limited point while retaining or reframing a larger claim.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/concessio-yield-to-strike-move-lookup",
  title: "Concessio Yield to Strike Move Lookup",
  description:
    "Offline bounded reference card: Concessio yields a limited point while retaining or reframing a larger claim. References Quintilian, Institutio Oratoria; Aristotle, Rhetoric; Silva Rhetoricae rhetorical terminology. A concession is not necessarily agreement with every premise.",
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
