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
          "Non-QM mortgages are not synonymous with illegal loans; bank-statement income methods can differ under lender programs.",
        reference: "CFPB, qualified mortgage and ability-to-repay guidance.",
        limitations:
          "Non-QM does not establish exemption from applicable underwriting law, approval or safe affordability.",
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
      text: "Non-QM mortgages are not synonymous with illegal loans; bank-statement income methods can differ under lender programs.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/non-qm-bank-statement-programs-self-employed-underwriting-lookup",
  title: "Non Qm Bank Statement Programs Self Employed Underwriting Lookup",
  description:
    "Bounded offline reference: Non-QM mortgages are not synonymous with illegal loans; bank-statement income methods can differ under lender programs. Source: CFPB, qualified mortgage and ability-to-repay guidance. Non-QM does not establish exemption from applicable underwriting law, approval or safe affordability. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
