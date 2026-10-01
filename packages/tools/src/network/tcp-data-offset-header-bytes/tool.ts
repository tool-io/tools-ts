import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ dataOffset: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "dataOffset", label: "Data offset", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.dataOffset, 5, 15);
  return H.finish({
    headerBytes: i.dataOffset * 4,
    optionBytes: (i.dataOffset - 5) * 4,
  });
};
export const example = {
  input: { dataOffset: 6 },
  output: { result: { headerBytes: 24, optionBytes: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/tcp-data-offset-header-bytes",
  title: "Network: TCP Data Offset Header Bytes Tool",
  description:
    "Translate the valid four-bit TCP data-offset field to total header and option-byte counts; no packet-length or option-content validation.",
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
          headerBytes: { type: "number" },
          optionBytes: { type: "number" },
        },
        required: ["headerBytes", "optionBytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
