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
          "Self-funded ASO arrangements separate employer benefit funding from administration; fully insured arrangements transfer defined risk to an insurer.",
        reference: "US Department of Labor, ERISA health-plan materials.",
        limitations:
          "ERISA preemption and state mandates have exceptions and distinctions, including stop-loss; not exemption from all law.",
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
      text: "Self-funded ASO arrangements separate employer benefit funding from administration; fully insured arrangements transfer defined risk to an insurer.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/erisa-self-funded-aso-versus-fully-insured-mandate-exemption",
  title: "Erisa Self Funded Aso Versus Fully Insured Mandate Exemption",
  description:
    "Bounded offline reference: Self-funded ASO arrangements separate employer benefit funding from administration; fully insured arrangements transfer defined risk to an insurer. Source: US Department of Labor, ERISA health-plan materials. ERISA preemption and state mandates have exceptions and distinctions, including stop-loss; not exemption from all law. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
