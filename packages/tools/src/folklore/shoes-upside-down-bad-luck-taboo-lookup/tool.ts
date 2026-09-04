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
          "Upside-down-shoe bad-luck narratives are locally variable household taboos.",
        reference: "Comparative household superstition collections.",
        limitations:
          "No causal danger, universal required correction or religious obligation inferred.",
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
      text: "Upside-down-shoe bad-luck narratives are locally variable household taboos.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/shoes-upside-down-bad-luck-taboo-lookup",
  title: "Shoes Upside Down Bad Luck Taboo Lookup",
  description:
    "Bounded offline reference: Upside-down-shoe bad-luck narratives are locally variable household taboos. Source: Comparative household superstition collections. No causal danger, universal required correction or religious obligation inferred. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
