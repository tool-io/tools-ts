import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
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
          "Bostrom distinguishes speed, collective and quality forms of superintelligence, not a universally canonical letter-class system.",
        reference: "Bostrom, Superintelligence 2014.",
        limitations:
          "The title premise is corrected; no quantitative capability threshold or current model grading.",
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
      text: "Bostrom distinguishes speed, collective and quality forms of superintelligence, not a universally canonical letter-class system.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/bostrom-posthuman-superintelligence-class-letter-taxonomy",
  title: "Bostrom Posthuman Superintelligence Class Letter Taxonomy",
  description:
    "Bounded offline reference: Bostrom distinguishes speed, collective and quality forms of superintelligence, not a universally canonical letter-class system. Source: Bostrom, Superintelligence 2014. The title premise is corrected; no quantitative capability threshold or current model grading. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
