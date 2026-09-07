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
          "Stasis questions can concern whether an act occurred, factual definition, quality or evaluation, and procedure/policy.",
        reference:
          "Quintilian, Institutio Oratoria; Aristotle, Rhetoric; Silva Rhetoricae rhetorical terminology.",
        limitations:
          "Taxonomies and counts vary by rhetorical school; no legal determination.",
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
      text: "Stasis questions can concern whether an act occurred, factual definition, quality or evaluation, and procedure/policy.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/stasis-theory-fact-definition-quality-policy-lookup",
  title: "Stasis Theory Fact Definition Quality Policy Lookup",
  description:
    "Offline bounded reference card: Stasis questions can concern whether an act occurred, factual definition, quality or evaluation, and procedure/policy. References Quintilian, Institutio Oratoria; Aristotle, Rhetoric; Silva Rhetoricae rhetorical terminology. Taxonomies and counts vary by rhetorical school; no legal determination.",
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
