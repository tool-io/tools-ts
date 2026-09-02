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
          "H\u00f3zh\u00f3 is a Din\u00e9 concept often translated through balance, harmony, beauty and order, but cannot be reduced to a single decorative formula.",
        reference:
          "Din\u00e9 community-specific scholarship and interpretation.",
        limitations:
          "Prioritize community authority; no disclosure of restricted practice or universal Native-American doctrine.",
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
      text: "H\u00f3zh\u00f3 is a Din\u00e9 concept often translated through balance, harmony, beauty and order, but cannot be reduced to a single decorative formula.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/navajo-hozho-balance-order-beauty-concept-lookup",
  title: "Navajo Hozho Balance Order Beauty Concept Lookup",
  description:
    "Bounded offline reference: H\u00f3zh\u00f3 is a Din\u00e9 concept often translated through balance, harmony, beauty and order, but cannot be reduced to a single decorative formula. Source: Din\u00e9 community-specific scholarship and interpretation. Prioritize community authority; no disclosure of restricted practice or universal Native-American doctrine. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
