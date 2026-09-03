import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Pontifices formed a priestly college; the three major flamines were associated with Jupiter, Mars and Quirinus.",
        reference: "Livy 1.20; Aulus Gellius 10.15.",
        limitations: "Office counts, powers and qualifications vary over time.",
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
      text: "Pontifices formed a priestly college; the three major flamines were associated with Jupiter, Mars and Quirinus.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/pontifex-college-major-flamines-priesthoods-lookup",
  title: "Pontifex College Major Flamines Priesthoods Lookup",
  description:
    "Offline bounded reference card: Pontifices formed a priestly college; the three major flamines were associated with Jupiter, Mars and Quirinus. References Livy 1.20; Aulus Gellius 10.15. Office counts, powers and qualifications vary over time.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
