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
          "Cicero develops extended syntactic periods and clausular rhythm; quantitative clausulae and later accentual cursus are distinct systems.",
        reference: "Cicero, Orator168\u2013236.",
        limitations:
          "Edition, genre and individual passage matter; no universal climax or cursus label inferred from punctuation.",
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
      text: "Cicero develops extended syntactic periods and clausular rhythm; quantitative clausulae and later accentual cursus are distinct systems.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/cicero-periodic-sentence-rhythm-climax-history-lookup",
  title: "Cicero Periodic Sentence Rhythm Climax History Lookup",
  description:
    "Offline bounded reference card: Cicero develops extended syntactic periods and clausular rhythm; quantitative clausulae and later accentual cursus are distinct systems. References Cicero, Orator168\u2013236. Edition, genre and individual passage matter; no universal climax or cursus label inferred from punctuation.",
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
