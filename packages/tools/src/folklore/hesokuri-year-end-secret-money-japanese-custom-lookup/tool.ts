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
          "Hesokuri refers to privately saved money in Japanese usage; a universal year-end festival custom is not established by that word.",
        reference: "Japanese lexical usage, hesokuri.",
        limitations:
          "Corrects the milestone premise rather than inventing a single ritual or household rule.",
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
      text: "Hesokuri refers to privately saved money in Japanese usage; a universal year-end festival custom is not established by that word.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/hesokuri-year-end-secret-money-japanese-custom-lookup",
  title: "Hesokuri Year End Secret Money Japanese Custom Lookup",
  description:
    "Bounded offline reference: Hesokuri refers to privately saved money in Japanese usage; a universal year-end festival custom is not established by that word. Source: Japanese lexical usage, hesokuri. Corrects the milestone premise rather than inventing a single ritual or household rule. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
