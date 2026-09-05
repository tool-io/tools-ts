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
          "Term conversion privileges can allow conversion to specified permanent coverage without new evidence of insurability during contract-defined windows.",
        reference: "Actual life-policy conversion provisions.",
        limitations:
          "Not every policy permits conversion to every whole-life product or at every age; current contract terms govern.",
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
      text: "Term conversion privileges can allow conversion to specified permanent coverage without new evidence of insurability during contract-defined windows.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/term-conversion-privilege-whole-life-no-exam-window-lookup",
  title: "Term Conversion Privilege Whole Life No Exam Window Lookup",
  description:
    "Bounded offline reference: Term conversion privileges can allow conversion to specified permanent coverage without new evidence of insurability during contract-defined windows. Source: Actual life-policy conversion provisions. Not every policy permits conversion to every whole-life product or at every age; current contract terms govern. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
