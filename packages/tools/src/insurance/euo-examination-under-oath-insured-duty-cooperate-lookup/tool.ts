import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, notice } from "../batch45-shared.js";
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
          "An examination under oath can be a contractual claim-investigation duty under applicable policy provisions and law.",
        reference: "Property insurance policy conditions.",
        limitations:
          "Scope, notice, rights and consequences require exact jurisdiction/contract review; no legal instruction to waive rights.",
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
      text: "An examination under oath can be a contractual claim-investigation duty under applicable policy provisions and law.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/euo-examination-under-oath-insured-duty-cooperate-lookup",
  title: "Euo Examination Under Oath Insured Duty Cooperate Lookup",
  description:
    "Bounded offline reference: An examination under oath can be a contractual claim-investigation duty under applicable policy provisions and law. Source: Property insurance policy conditions. Scope, notice, rights and consequences require exact jurisdiction/contract review; no legal instruction to waive rights. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
