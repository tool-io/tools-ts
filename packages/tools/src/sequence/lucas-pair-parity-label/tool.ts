import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ index: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", label: "Index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.index, 0, 1000000000);
  return H.finish({
    currentOdd: i.index % 3 !== 0,
    nextOdd: (i.index + 1) % 3 !== 0,
  });
};
export const example = {
  input: { index: 0 },
  output: { result: { currentOdd: false, nextOdd: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sequence/lucas-pair-parity-label",
  title: "Sequence: Lucas Pair Parity Label Tool",
  description:
    "Report adjacent canonical Lucas-number parities using L0=2,L1=1 and the period-three parity recurrence; no value enumeration.",
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
          currentOdd: { type: "boolean" },
          nextOdd: { type: "boolean" },
        },
        required: ["currentOdd", "nextOdd"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
