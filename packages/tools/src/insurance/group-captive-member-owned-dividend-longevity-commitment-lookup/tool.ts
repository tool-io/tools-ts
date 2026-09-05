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
          "Group captives are member-associated risk-financing structures with participation, capital and governance obligations.",
        reference: "Captive insurance program documentation.",
        limitations:
          "Dividends depend on actual results and rules, not guaranteed distributions or universal commitment length.",
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
      text: "Group captives are member-associated risk-financing structures with participation, capital and governance obligations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/group-captive-member-owned-dividend-longevity-commitment-lookup",
  title: "Group Captive Member Owned Dividend Longevity Commitment Lookup",
  description:
    "Bounded offline reference: Group captives are member-associated risk-financing structures with participation, capital and governance obligations. Source: Captive insurance program documentation. Dividends depend on actual results and rules, not guaranteed distributions or universal commitment length. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
