import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ size: number; cycleCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "size", label: "Size", kind: "integer" },
  { id: "cycleCount", label: "Cycle count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.size, 0, 1000000);
  H.int(i.cycleCount, i.size === 0 ? 0 : 1, i.size);
  return H.finish({
    odd: (i.size - i.cycleCount) % 2 === 1,
    sign: (i.size - i.cycleCount) % 2 === 0 ? 1 : -1,
  });
};
export const example = {
  input: { size: 5, cycleCount: 2 },
  output: { result: { odd: true, sign: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/permutation-cycle-parity-from-count",
  title: "Combinatorics: Permutation Cycle Parity From Count Tool",
  description:
    "Derive permutation parity from a caller-established size and disjoint-cycle count including fixed points; no cycle discovery.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { odd: { type: "boolean" }, sign: { type: "number" } },
        required: ["odd", "sign"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
