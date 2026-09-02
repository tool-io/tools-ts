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
          "Hambidges dynamic symmetry discusses root rectangles, including ratios square-root2,3,4 and 5.",
        reference: "Hambidge, The Elements of Dynamic Symmetry 1926.",
        limitations:
          "A design theory, not proof of every ancient construction or superior aesthetics.",
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
      text: "Hambidges dynamic symmetry discusses root rectangles, including ratios square-root2,3,4 and 5.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/hambidge-dynamic-symmetry-root-rectangles-lookup",
  title: "Hambidge Dynamic Symmetry Root Rectangles Lookup",
  description:
    "Bounded offline reference: Hambidges dynamic symmetry discusses root rectangles, including ratios square-root2,3,4 and 5. Source: Hambidge, The Elements of Dynamic Symmetry 1926. A design theory, not proof of every ancient construction or superior aesthetics. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
