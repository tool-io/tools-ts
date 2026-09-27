import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ fromOrdinal: number; toOrdinal: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fromOrdinal", label: "From ordinal", kind: "integer" },
  { id: "toOrdinal", label: "To ordinal", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.fromOrdinal, 1, 60);
  H.int(i.toOrdinal, 1, 60);
  const forward = H.mod(i.toOrdinal - i.fromOrdinal, 60),
    backward = H.mod(i.fromOrdinal - i.toOrdinal, 60);
  return H.finish({ forward, backward, shortest: Math.min(forward, backward) });
};
export const example = {
  input: { fromOrdinal: 60, toOrdinal: 1 },
  output: { result: { forward: 1, backward: 59, shortest: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ganzhi/pair-cycle-distance",
  title: "Sexagenary Pair Distance Calculator",
  description:
    "Measure directed and shortest sexagenary-cycle separation between validated one-based pair ordinals; not elapsed calendar years.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          backward: { type: "number" },
          forward: { type: "number" },
          shortest: { type: "number" },
        },
        required: ["backward", "forward", "shortest"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
