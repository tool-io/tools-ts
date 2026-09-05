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
          "Split-dollar arrangements allocate life-policy costs/benefits between parties under documented economic-benefit or loan-type frameworks.",
        reference: "IRS, split-dollar life-insurance regulations.",
        limitations:
          "Tax, ownership and repayment depend on actual arrangements; not one universal premium-sharing formula.",
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
      text: "Split-dollar arrangements allocate life-policy costs/benefits between parties under documented economic-benefit or loan-type frameworks.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/split-dollar-employer-employee-premium-sharing-arrangement-lookup",
  title: "Split Dollar Employer Employee Premium Sharing Arrangement Lookup",
  description:
    "Bounded offline reference: Split-dollar arrangements allocate life-policy costs/benefits between parties under documented economic-benefit or loan-type frameworks. Source: IRS, split-dollar life-insurance regulations. Tax, ownership and repayment depend on actual arrangements; not one universal premium-sharing formula. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
