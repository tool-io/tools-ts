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
          "Guaranteed issue typically dispenses with medical underwriting questions/exams in defined products; simplified issue can use limited health questions/data.",
        reference: "Life-insurance underwriting/product disclosures.",
        limitations:
          "Age limits, graded benefits, waiting periods and pricing vary; no acceptance guarantee from a general label.",
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
      text: "Guaranteed issue typically dispenses with medical underwriting questions/exams in defined products; simplified issue can use limited health questions/data.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/guaranteed-issue-versus-simplified-issue-underwriting-distinction",
  title: "Guaranteed Issue Versus Simplified Issue Underwriting Distinction",
  description:
    "Bounded offline reference: Guaranteed issue typically dispenses with medical underwriting questions/exams in defined products; simplified issue can use limited health questions/data. Source: Life-insurance underwriting/product disclosures. Age limits, graded benefits, waiting periods and pricing vary; no acceptance guarantee from a general label. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
