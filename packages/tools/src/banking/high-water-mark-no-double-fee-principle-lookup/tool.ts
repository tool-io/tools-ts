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
          "A high-water-mark mechanism can restrict renewed performance charges until specified earlier performance levels are recovered.",
        reference: "Fund offering documents and investment fee disclosures.",
        limitations:
          "Crystallization, resets, subscriptions and share-class adjustments depend on actual agreements; no generic exact fee calculation.",
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
      text: "A high-water-mark mechanism can restrict renewed performance charges until specified earlier performance levels are recovered.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/high-water-mark-no-double-fee-principle-lookup",
  title: "High Water Mark No Double Fee Principle Lookup",
  description:
    "Bounded offline reference: A high-water-mark mechanism can restrict renewed performance charges until specified earlier performance levels are recovered. Source: Fund offering documents and investment fee disclosures. Crystallization, resets, subscriptions and share-class adjustments depend on actual agreements; no generic exact fee calculation. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
