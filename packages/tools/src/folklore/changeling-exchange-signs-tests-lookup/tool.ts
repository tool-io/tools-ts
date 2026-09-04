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
          "Changeling beliefs historically interpreted perceived differences in infants or family members as supernatural exchange.",
        reference:
          "Simpson and Roud, A Dictionary of English Folklore, changeling.",
        limitations:
          "Such beliefs caused abuse and misidentified disability. No signs/tests, diagnosis or harmful treatment instructions are supplied; seek qualified care for health concerns.",
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
      text: "Changeling beliefs historically interpreted perceived differences in infants or family members as supernatural exchange.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/changeling-exchange-signs-tests-lookup",
  title: "Changeling Exchange Signs Tests Lookup",
  description:
    "Bounded offline reference: Changeling beliefs historically interpreted perceived differences in infants or family members as supernatural exchange. Source: Simpson and Roud, A Dictionary of English Folklore, changeling. Such beliefs caused abuse and misidentified disability. No signs/tests, diagnosis or harmful treatment instructions are supplied; seek qualified care for health concerns. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
