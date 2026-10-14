import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ offset: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "offset", kind: "integer", label: "offset" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.offset, 0, 16383);
  return H.finish({
    bytes: [192 + Math.floor(i.offset / 256), i.offset % 256],
  });
};
export const example = {
  input: { offset: 300 },
  output: { result: { bytes: [193, 44] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/compression-pointer-offset-formatter",
  title: "DNS Compression Pointer Offset Formatter",
  description:
    "Format an explicit 14-bit packet offset as a DNS compression pointer token; does not verify packet layout or target labels.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { bytes: { type: "array", items: { type: "number" } } },
        required: ["bytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
