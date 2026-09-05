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
          "Equine mortality and major-medical protections address distinct death/loss and qualifying treatment exposures under actual policies.",
        reference: "Equine policy forms.",
        limitations:
          "Limits, conditions, eligibility and exclusions vary; not veterinary diagnosis or guaranteed payment.",
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
      text: "Equine mortality and major-medical protections address distinct death/loss and qualifying treatment exposures under actual policies.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/equine-mortality-versus-major-medical-horse-coverage-lookup",
  title: "Equine Mortality Versus Major Medical Horse Coverage Lookup",
  description:
    "Bounded offline reference: Equine mortality and major-medical protections address distinct death/loss and qualifying treatment exposures under actual policies. Source: Equine policy forms. Limits, conditions, eligibility and exclusions vary; not veterinary diagnosis or guaranteed payment. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
