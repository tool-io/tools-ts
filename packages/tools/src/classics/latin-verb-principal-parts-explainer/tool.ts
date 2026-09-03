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
          "A common Latin four-part citation gives first-person present indicative, present infinitive, first-person perfect indicative, and supine or perfect passive participial form.",
        reference:
          "Allen and Greenough, New Latin Grammar, verb principal parts.",
        limitations:
          "Deponent, defective and irregular verbs vary; this is a role explanation, not automatic stem derivation.",
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
      text: "A common Latin four-part citation gives first-person present indicative, present infinitive, first-person perfect indicative, and supine or perfect passive participial form.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/latin-verb-principal-parts-explainer",
  title: "Latin Verb Principal Parts Explainer",
  description:
    "Offline bounded reference card: A common Latin four-part citation gives first-person present indicative, present infinitive, first-person perfect indicative, and supine or perfect passive participial form. References Allen and Greenough, New Latin Grammar, verb principal parts. Deponent, defective and irregular verbs vary; this is a role explanation, not automatic stem derivation.",
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
