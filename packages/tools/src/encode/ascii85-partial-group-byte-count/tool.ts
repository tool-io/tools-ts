import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ byteCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "byteCount", label: "Byte count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.byteCount, 1, 3);
  return H.finish({ symbolCount: i.byteCount + 1 });
};
export const example = {
  input: { byteCount: 2 },
  output: { result: { symbolCount: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/ascii85-partial-group-byte-count",
  title: "Encoding: Ascii85 Partial Group Byte Count Tool",
  description:
    "Resolve the ordinary Ascii85 final partial-group symbol count for one through three remaining bytes; excludes z shorthand and full groups.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { symbolCount: { type: "number" } },
        required: ["symbolCount"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
