import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ p: number; q: number; base: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "p", label: "P", kind: "number" },
  { id: "q", label: "Q", kind: "number" },
  { id: "base", label: "Base", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.p, 0, 1);
  H.bounded(i.q, 0, 1);
  H.check(i.base > 1 && (i.p === 0 || i.q > 0));
  return H.finish({
    relativeEntropyTerm:
      i.p === 0
        ? 0
        : (i.p * (Math.log(i.p) - Math.log(i.q))) / Math.log(i.base),
  });
};
export const example = {
  input: { p: 0.5, q: 0.25, base: 2 },
  output: { result: { relativeEntropyTerm: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/relative-entropy-single-cell-term",
  title: "Information: Relative Entropy Single Cell Term Tool",
  description:
    "Compute one p*log(p/q) relative-entropy contribution, allowing zero-p limit and rejecting positive p with zero q rather than returning infinity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { relativeEntropyTerm: { type: "number" } },
        required: ["relativeEntropyTerm"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
