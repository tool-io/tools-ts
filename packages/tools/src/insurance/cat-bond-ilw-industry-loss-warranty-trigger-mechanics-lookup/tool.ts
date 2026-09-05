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
          "Cat bonds and industry-loss warranties can use different indemnity, parametric, modeled or industry-loss triggers.",
        reference: "Catastrophe-risk financing literature.",
        limitations:
          "Trigger basis risk, attachment, calculation agents and actual contracts matter; no guaranteed payout or investor safety.",
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
      text: "Cat bonds and industry-loss warranties can use different indemnity, parametric, modeled or industry-loss triggers.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/cat-bond-ilw-industry-loss-warranty-trigger-mechanics-lookup",
  title: "Cat Bond ILW Industry Loss Warranty Trigger Mechanics Lookup",
  description:
    "Bounded offline reference: Cat bonds and industry-loss warranties can use different indemnity, parametric, modeled or industry-loss triggers. Source: Catastrophe-risk financing literature. Trigger basis risk, attachment, calculation agents and actual contracts matter; no guaranteed payout or investor safety. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
