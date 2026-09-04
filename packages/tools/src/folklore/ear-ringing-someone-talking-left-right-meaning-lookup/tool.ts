import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

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
          "Ear-ringing sayings can associate sides with someone speaking about a person in particular versions.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "Not evidence of remote speech or a medical explanation for tinnitus.",
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
      text: "Ear-ringing sayings can associate sides with someone speaking about a person in particular versions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/ear-ringing-someone-talking-left-right-meaning-lookup",
  title: "Ear Ringing Someone Talking Left Right Meaning Lookup",
  description:
    "Bounded offline reference: Ear-ringing sayings can associate sides with someone speaking about a person in particular versions. Source: Simpson and Roud, A Dictionary of English Folklore. Not evidence of remote speech or a medical explanation for tinnitus. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
