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
          "Narratio presents the account of circumstances or facts needed for the argument.",
        reference:
          "Quintilian, Institutio Oratoria; Aristotle, Rhetoric; Silva Rhetoricae rhetorical terminology.",
        limitations:
          "Stated facts still require independent evidence and qualification.",
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
      text: "Narratio presents the account of circumstances or facts needed for the argument.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/narratio-statement-of-facts-section-lookup",
  title: "Narratio Statement of Facts Section Lookup",
  description:
    "Offline bounded reference card: Narratio presents the account of circumstances or facts needed for the argument. References Quintilian, Institutio Oratoria; Aristotle, Rhetoric; Silva Rhetoricae rhetorical terminology. Stated facts still require independent evidence and qualification.",
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
