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
          "D&O Side Acommonly covers qualifying non-indemnified individuals, Side Breimburses qualifying entity indemnification, and Side Caddresses specified entity coverage.",
        reference: "D&Opolicy wording and insurance coverage literature.",
        limitations:
          "Scope, allocation, limits and exclusions vary, especially public-company securities coverage.",
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
      text: "D&O Side Acommonly covers qualifying non-indemnified individuals, Side Breimburses qualifying entity indemnification, and Side Caddresses specified entity coverage.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/do-side-a-b-c-coverage-split-lookup",
  title: "D&O Side A B C Coverage Split Lookup",
  description:
    "Bounded offline reference: D&O Side Acommonly covers qualifying non-indemnified individuals, Side Breimburses qualifying entity indemnification, and Side Caddresses specified entity coverage. Source: D&Opolicy wording and insurance coverage literature. Scope, allocation, limits and exclusions vary, especially public-company securities coverage. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
