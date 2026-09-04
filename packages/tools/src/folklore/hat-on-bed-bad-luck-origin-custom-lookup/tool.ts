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
          "Hat-on-bed bad-luck accounts have varied proposed explanations and local contexts.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "No single verified universal origin or causal danger inferred.",
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
      text: "Hat-on-bed bad-luck accounts have varied proposed explanations and local contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/hat-on-bed-bad-luck-origin-custom-lookup",
  title: "Hat On Bed Bad Luck Origin Custom Lookup",
  description:
    "Bounded offline reference: Hat-on-bed bad-luck accounts have varied proposed explanations and local contexts. Source: Simpson and Roud, A Dictionary of English Folklore. No single verified universal origin or causal danger inferred. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
