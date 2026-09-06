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
          "No-grade/bodybag outcomes can concern authenticity, alteration, damage or program-specific eligibility.",
        reference: "Grading-service submission and no-grade guidance.",
        limitations:
          "Reasons/codes depend on service and era; a failed submission does not by itself prove counterfeit.",
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
      text: "No-grade/bodybag outcomes can concern authenticity, alteration, damage or program-specific eligibility.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/bodybag-no-grade-common-rejection-reasons-list",
  title: "Bodybag No Grade Common Rejection Reasons List",
  description:
    "Bounded offline reference: No-grade/bodybag outcomes can concern authenticity, alteration, damage or program-specific eligibility. Source: Grading-service submission and no-grade guidance. Reasons/codes depend on service and era; a failed submission does not by itself prove counterfeit. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
