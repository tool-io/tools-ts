import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ left: string; right: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "left", kind: "string", label: "left" },
  { id: "right", kind: "string", label: "right" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bits(i.left);
  H.bits(i.right);
  H.check(i.left.length === i.right.length);
  return H.finish({
    holds: i.left.split("").every((x, j) => !(x === "1" && i.right[j] === "1")),
  });
};
export const example = {
  input: { left: "100", right: "110" },
  output: { result: { holds: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-disjoint-mask-check",
  title: "Bit String Disjoint Mask Check",
  description:
    "Check exact equal-width bit-mask disjointness at each string position; no implicit padding or integer coercion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { holds: { type: "boolean" } },
        required: ["holds"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
