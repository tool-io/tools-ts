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
          "The Federal Reserve reduced reserve-requirement ratios to zero effective March26,2020.",
        reference: "Federal Reserve, March15,2020 reserve-requirement release.",
        limitations:
          "Historical US rule, not all liquidity/capital requirements eliminated or a universal global requirement.",
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
      text: "The Federal Reserve reduced reserve-requirement ratios to zero effective March26,2020.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/reserve-requirement-zero-percent-2020-change-history-lookup",
  title: "Reserve Requirement Zero Percent 2020 Change History Lookup",
  description:
    "Bounded offline reference: The Federal Reserve reduced reserve-requirement ratios to zero effective March26,2020. Source: Federal Reserve, March15,2020 reserve-requirement release. Historical US rule, not all liquidity/capital requirements eliminated or a universal global requirement. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
