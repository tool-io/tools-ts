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
          "Discount-window primary credit is collateralized central-bank lending under eligibility terms; stigma is a discussed behavioral/institutional issue.",
        reference: "Federal Reserve, discount-window guidance.",
        limitations:
          "No live rate, guaranteed approval or inference that borrowing alone proves insolvency.",
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
      text: "Discount-window primary credit is collateralized central-bank lending under eligibility terms; stigma is a discussed behavioral/institutional issue.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/discount-window-primary-credit-stigma-borrowing-history-lookup",
  title: "Discount Window Primary Credit Stigma Borrowing History Lookup",
  description:
    "Bounded offline reference: Discount-window primary credit is collateralized central-bank lending under eligibility terms; stigma is a discussed behavioral/institutional issue. Source: Federal Reserve, discount-window guidance. No live rate, guaranteed approval or inference that borrowing alone proves insolvency. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
