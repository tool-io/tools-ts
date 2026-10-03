import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ outputIndex: number; sourceCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "outputIndex", label: "Output index", kind: "integer" },
  { id: "sourceCount", label: "Source count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.outputIndex, 0, 1000000000);
  H.int(i.sourceCount, 1, 128);
  return H.finish({
    sourceIndex: i.outputIndex % i.sourceCount,
    indexWithinSource: Math.floor(i.outputIndex / i.sourceCount),
  });
};
export const example = {
  input: { outputIndex: 7, sourceCount: 3 },
  output: { result: { sourceIndex: 1, indexWithinSource: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sequence/sequence-interleave-source-index",
  title: "Sequence: Sequence Interleave Source Index Tool",
  description:
    "Resolve one position in an equal-length round-robin interleave to its ordered source and local element index, without constructing the interleave.",
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
          indexWithinSource: { type: "number" },
          sourceIndex: { type: "number" },
        },
        required: ["indexWithinSource", "sourceIndex"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
