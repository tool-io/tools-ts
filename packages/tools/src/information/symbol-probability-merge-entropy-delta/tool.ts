import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  firstMass: number;
  secondMass: number;
  base: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstMass", label: "First mass", kind: "number" },
  { id: "secondMass", label: "Second mass", kind: "number" },
  { id: "base", label: "Base", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.base > 1 &&
      i.firstMass >= 0 &&
      i.secondMass >= 0 &&
      i.firstMass + i.secondMass <= 1,
  );
  const term = (p: number) =>
    p === 0 ? 0 : (-p * Math.log(p)) / Math.log(i.base);
  return H.finish({
    entropyDelta:
      term(i.firstMass + i.secondMass) - term(i.firstMass) - term(i.secondMass),
  });
};
export const example = {
  input: { firstMass: 0.25, secondMass: 0.25, base: 2 },
  output: { result: { entropyDelta: -0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/symbol-probability-merge-entropy-delta",
  title: "Information: Symbol Probability Merge Entropy Delta Tool",
  description:
    "Compute the entropy change when exactly two disjoint symbol masses are merged; all other masses stay fixed and zero terms use their continuous limit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { entropyDelta: { type: "number" } },
        required: ["entropyDelta"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
