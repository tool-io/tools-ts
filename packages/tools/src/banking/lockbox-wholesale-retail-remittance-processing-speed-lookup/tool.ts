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
          "Wholesale and retail lockboxes collect/process receivables through differing remittance workflows.",
        reference: "Treasury cash-management documentation.",
        limitations:
          "Actual processing time depends on observed service levels; no guaranteed faster funding or invented latency.",
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
      text: "Wholesale and retail lockboxes collect/process receivables through differing remittance workflows.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/lockbox-wholesale-retail-remittance-processing-speed-lookup",
  title: "Lockbox Wholesale Retail Remittance Processing Speed Lookup",
  description:
    "Bounded offline reference: Wholesale and retail lockboxes collect/process receivables through differing remittance workflows. Source: Treasury cash-management documentation. Actual processing time depends on observed service levels; no guaranteed faster funding or invented latency. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
