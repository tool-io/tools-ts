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
          "Aristotle relates dialectic and rhetoric as capacities for examining arguments in different settings rather than identical formal sciences.",
        reference:
          "Quintilian, Institutio Oratoria; Aristotle, Rhetoric; Silva Rhetoricae rhetorical terminology.",
        limitations:
          "Probability is not a license to ignore evidence; traditions differ.",
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
      text: "Aristotle relates dialectic and rhetoric as capacities for examining arguments in different settings rather than identical formal sciences.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/dialectic-vs-rhetoric-probability-distinction-lookup",
  title: "Dialectic vs Rhetoric Probability Distinction Lookup",
  description:
    "Offline bounded reference card: Aristotle relates dialectic and rhetoric as capacities for examining arguments in different settings rather than identical formal sciences. References Quintilian, Institutio Oratoria; Aristotle, Rhetoric; Silva Rhetoricae rhetorical terminology. Probability is not a license to ignore evidence; traditions differ.",
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
