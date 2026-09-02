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
          "Federal Reserve large-scale asset-purchase rounds followed the 2008 crisis, with later purchases and the 2020 pandemic response.",
        reference: "Federal Reserve, historical monetary-policy releases.",
        limitations:
          "Different rounds, objectives and instruments must be dated; not a complete purchase ledger or guaranteed inflation effect.",
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
      text: "Federal Reserve large-scale asset-purchase rounds followed the 2008 crisis, with later purchases and the 2020 pandemic response.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/quantitative-easing-asset-purchase-rounds-history-lookup",
  title: "Quantitative Easing Asset Purchase Rounds History Lookup",
  description:
    "Bounded offline reference: Federal Reserve large-scale asset-purchase rounds followed the 2008 crisis, with later purchases and the 2020 pandemic response. Source: Federal Reserve, historical monetary-policy releases. Different rounds, objectives and instruments must be dated; not a complete purchase ledger or guaranteed inflation effect. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
