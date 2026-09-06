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
          "Scyphate coins have cup-shaped flans whose relief/curvature affects viewing and condition assessment.",
        reference: "Byzantine coin cataloguing/conservation literature.",
        limitations:
          "No flattening, abrasion or handling technique presented as safe; use appropriate qualified conservation advice.",
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
      text: "Scyphate coins have cup-shaped flans whose relief/curvature affects viewing and condition assessment.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/scyphate-hyperpyron-cup-curve-handling-grade-note",
  title: "Scyphate Hyperpyron Cup Curve Handling Grade Note",
  description:
    "Bounded offline reference: Scyphate coins have cup-shaped flans whose relief/curvature affects viewing and condition assessment. Source: Byzantine coin cataloguing/conservation literature. No flattening, abrasion or handling technique presented as safe; use appropriate qualified conservation advice. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
