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
          "No-penalty CD spermit withdrawals under disclosed conditions that differ from standard early-withdrawal-penalty terms.",
        reference: "CFPB, deposit disclosure guidance; issuer CD contracts.",
        limitations:
          "Waiting periods, whole/partial withdrawals and yield differences depend on actual contracts; no product recommendation.",
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
      text: "No-penalty CD spermit withdrawals under disclosed conditions that differ from standard early-withdrawal-penalty terms.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/no-penalty-cd-versus-standard-cd-flexibility-yield-tradeoff-lookup",
  title: "No Penalty Cd Versus Standard Cd Flexibility Yield Tradeoff Lookup",
  description:
    "Bounded offline reference: No-penalty CD spermit withdrawals under disclosed conditions that differ from standard early-withdrawal-penalty terms. Source: CFPB, deposit disclosure guidance; issuer CD contracts. Waiting periods, whole/partial withdrawals and yield differences depend on actual contracts; no product recommendation. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
