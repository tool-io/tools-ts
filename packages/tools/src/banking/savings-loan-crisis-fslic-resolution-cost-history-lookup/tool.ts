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
          "The savings-and-loan crisis led to major resolutions and institutional changes including the 1989 FIRREA framework.",
        reference:
          "FDIC, History of the Eighties; GAO resolution-cost studies.",
        limitations:
          "Cost totals depend on nominal/real basis, public/private shares and as-of date; no single unsupported exact total supplied.",
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
      text: "The savings-and-loan crisis led to major resolutions and institutional changes including the 1989 FIRREA framework.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/savings-loan-crisis-fslic-resolution-cost-history-lookup",
  title: "Savings Loan Crisis Fslic Resolution Cost History Lookup",
  description:
    "Bounded offline reference: The savings-and-loan crisis led to major resolutions and institutional changes including the 1989 FIRREA framework. Source: FDIC, History of the Eighties; GAO resolution-cost studies. Cost totals depend on nominal/real basis, public/private shares and as-of date; no single unsupported exact total supplied. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
