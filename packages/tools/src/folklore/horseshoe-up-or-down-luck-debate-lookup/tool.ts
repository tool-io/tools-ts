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
          "Horseshoe-up and horseshoe-down interpretations coexist in local traditions.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "No orientation actually guarantees luck or universal cultural meaning.",
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
      text: "Horseshoe-up and horseshoe-down interpretations coexist in local traditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/horseshoe-up-or-down-luck-debate-lookup",
  title: "Horseshoe Up Or Down Luck Debate Lookup",
  description:
    "Bounded offline reference: Horseshoe-up and horseshoe-down interpretations coexist in local traditions. Source: Simpson and Roud, A Dictionary of English Folklore. No orientation actually guarantees luck or universal cultural meaning. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
