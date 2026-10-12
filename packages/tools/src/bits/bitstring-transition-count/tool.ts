import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string; circular: boolean }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bits", kind: "string", label: "bits" },
  { id: "circular", kind: "boolean", label: "circular" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bits(i.bits);
  let count = i.bits
    .split("")
    .filter((x, j) => j > 0 && x !== i.bits[j - 1]).length;
  if (i.circular && i.bits.length && i.bits[0] !== i.bits.at(-1)) count++;
  return H.finish({ count });
};
export const example = {
  input: { bits: "101", circular: true },
  output: { result: { count: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-transition-count",
  title: "Bit String Transition Count",
  description:
    "Count bit transitions along an explicit linear or circular string, adding the closure edge only when endpoints differ.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { count: { type: "number" } },
        required: ["count"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
