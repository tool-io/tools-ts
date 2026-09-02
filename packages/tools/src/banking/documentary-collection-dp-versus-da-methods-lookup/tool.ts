import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Documents against payment releases documents against payment; documents against acceptance uses acceptance of a time draft under collection instructions.",
        reference: "ICC, URC 522.",
        limitations:
          "Documentary collection is not a bank payment guarantee; actual terms, country risks and legal effects remain.",
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
      text: "Documents against payment releases documents against payment; documents against acceptance uses acceptance of a time draft under collection instructions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/documentary-collection-dp-versus-da-methods-lookup",
  title: "Documentary Collection DP Versus DA Methods Lookup",
  description:
    "Bounded offline reference: Documents against payment releases documents against payment; documents against acceptance uses acceptance of a time draft under collection instructions. Source: ICC, URC 522. Documentary collection is not a bank payment guarantee; actual terms, country risks and legal effects remain. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
