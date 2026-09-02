import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string", enum: ["R01", "R07"] },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        R01: "Insufficient funds:the available balance is inadequate under the applicable return context.",
        R07: "Authorization revoked by customer:applies under the applicable entry and authorization rules.",
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
  input: { topic: "R01" },
  output: {
    result: {
      text: "Insufficient funds:the available balance is inadequate under the applicable return context.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/ach-return-reason-codes-r01-r07-table-lookup",
  title: "ACH Return Reason CodesR01/R07 Table Lookup",
  description:
    "Bounded offline reference: Two bounded ACH return-code descriptions support exact normalized codes. Source: NACHA return-code documentation. Timing, eligibility and application depend on the applicable network rule edition. Supported topic keys: R01, R07. No complete external corpus or live policy implied.",
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
