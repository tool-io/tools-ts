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
          "Controlled-disbursement services report presentments to support funding decisions under specific daily schedules.",
        reference: "Bank treasury-service documentation.",
        limitations:
          "AM flash and late-day processes vary; not permission to create unsupported float or ignore presentment obligations.",
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
      text: "Controlled-disbursement services report presentments to support funding decisions under specific daily schedules.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/controlled-disbursement-am-flash-late-day-funding-lookup",
  title: "Controlled Disbursement Am Flash Late Day Funding Lookup",
  description:
    "Bounded offline reference: Controlled-disbursement services report presentments to support funding decisions under specific daily schedules. Source: Bank treasury-service documentation. AM flash and late-day processes vary; not permission to create unsupported float or ignore presentment obligations. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
