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
          "Neobanks may provide interfaces/services through partner-bank arrangements rather than hold a bank charter themselves.",
        reference: "FDIC and banking-agency third-party/fintech guidance.",
        limitations:
          "A partner claim does not prove every displayed balance is insured; verify bank, depositor records and product conditions.",
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
      text: "Neobanks may provide interfaces/services through partner-bank arrangements rather than hold a bank charter themselves.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/neobank-baas-partner-bank-sponsorship-model-explainer",
  title: "Neobank Baas Partner Bank Sponsorship Model Explainer",
  description:
    "Bounded offline reference: Neobanks may provide interfaces/services through partner-bank arrangements rather than hold a bank charter themselves. Source: FDIC and banking-agency third-party/fintech guidance. A partner claim does not prove every displayed balance is insured; verify bank, depositor records and product conditions. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
