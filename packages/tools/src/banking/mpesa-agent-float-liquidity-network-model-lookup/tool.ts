import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, money } from "../batch45-shared.js";
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
          "Mobile-money agents need both electronic float and cash liquidity to support customer transactions.",
        reference: "GSMA, mobile-money agent-network materials; M-Pesahistory.",
        limitations:
          "Actual balances, limits and settlement controls require institution verification; not a guaranteed liquidity model.",
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
      text: "Mobile-money agents need both electronic float and cash liquidity to support customer transactions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/mpesa-agent-float-liquidity-network-model-lookup",
  title: "Mpesa Agent Float Liquidity Network Model Lookup",
  description:
    "Bounded offline reference: Mobile-money agents need both electronic float and cash liquidity to support customer transactions. Source: GSMA, mobile-money agent-network materials; M-Pesahistory. Actual balances, limits and settlement controls require institution verification; not a guaranteed liquidity model. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
