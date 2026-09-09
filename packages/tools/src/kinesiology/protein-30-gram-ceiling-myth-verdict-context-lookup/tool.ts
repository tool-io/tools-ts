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
          "A fixed30-gram ceiling for all useful dietary protein is not supported as a universal absorption or utilization limit.",
        reference: "Protein feeding/dose-response research.",
        limitations:
          "Absorption, muscle protein synthesis and whole-body utilization are distinct; no individual intake prescription.",
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
      text: "A fixed30-gram ceiling for all useful dietary protein is not supported as a universal absorption or utilization limit.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/protein-30-gram-ceiling-myth-verdict-context-lookup",
  title: "Protein30 g Ceiling Myth Verdict Context Lookup",
  description:
    "Bounded offline reference: A fixed30-gram ceiling for all useful dietary protein is not supported as a universal absorption or utilization limit. Source: Protein feeding/dose-response research. Absorption, muscle protein synthesis and whole-body utilization are distinct; no individual intake prescription. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
