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
          "Waiver of subrogation can limit an insurers recovery rights against specified parties under a valid applicable provision.",
        reference: "Insurance contract/subrogation principles.",
        limitations:
          "Not an automatic waiver of all lawsuits, coverage or liability; actual wording and law govern.",
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
      text: "Waiver of subrogation can limit an insurers recovery rights against specified parties under a valid applicable provision.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/waiver-of-subrogation-meaning-lookup",
  title: "Waiver Of Subrogation Meaning Lookup",
  description:
    "Bounded offline reference: Waiver of subrogation can limit an insurers recovery rights against specified parties under a valid applicable provision. Source: Insurance contract/subrogation principles. Not an automatic waiver of all lawsuits, coverage or liability; actual wording and law govern. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
