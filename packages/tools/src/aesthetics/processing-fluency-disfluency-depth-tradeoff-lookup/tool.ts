import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

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
          "Processing-fluency accounts link ease of processing with some judgments, while disfluency may have different context-dependent effects.",
        reference:
          "Reber, Schwarz and Winkielman, Processing Fluency and Aesthetic Pleasure 2004.",
        limitations:
          "No universal shallow/deep tradeoff score or guaranteed effect.",
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
      text: "Processing-fluency accounts link ease of processing with some judgments, while disfluency may have different context-dependent effects.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/processing-fluency-disfluency-depth-tradeoff-lookup",
  title: "Processing Fluency Disfluency Depth Tradeoff Lookup",
  description:
    "Bounded offline reference: Processing-fluency accounts link ease of processing with some judgments, while disfluency may have different context-dependent effects. Source: Reber, Schwarz and Winkielman, Processing Fluency and Aesthetic Pleasure 2004. No universal shallow/deep tradeoff score or guaranteed effect. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
