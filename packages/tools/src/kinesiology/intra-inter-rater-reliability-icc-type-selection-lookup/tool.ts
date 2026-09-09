import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch47-shared.js";
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
          "ICCselection requires stating fixed/random raters, single/average measurements, and consistency versus absolute agreement.",
        reference: "Shrout and Fleiss 1979; McGraw and Wong 1996.",
        limitations:
          "Different ICCforms answer different questions; a high correlation alone is not agreement.",
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
      text: "ICCselection requires stating fixed/random raters, single/average measurements, and consistency versus absolute agreement.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/intra-inter-rater-reliability-icc-type-selection-lookup",
  title: "Intra Inter Rater Reliability Icc Type Selection Lookup",
  description:
    "Bounded offline reference: ICCselection requires stating fixed/random raters, single/average measurements, and consistency versus absolute agreement. Source: Shrout and Fleiss 1979; McGraw and Wong 1996. Different ICCforms answer different questions; a high correlation alone is not agreement. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
