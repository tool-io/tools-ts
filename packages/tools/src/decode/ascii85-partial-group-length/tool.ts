import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ symbolCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "symbolCount", label: "Symbol count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.symbolCount, 2, 4);
  return H.finish({ decodedBytes: i.symbolCount - 1 });
};
export const example = {
  input: { symbolCount: 3 },
  output: { result: { decodedBytes: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/ascii85-partial-group-length",
  title: "Decoding: Ascii85 Partial Group Length Tool",
  description:
    "Resolve the output-byte count of one ordinary Ascii85 final partial group of two through four symbols; excludes z shorthand and full groups.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { decodedBytes: { type: "number" } },
        required: ["decodedBytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
