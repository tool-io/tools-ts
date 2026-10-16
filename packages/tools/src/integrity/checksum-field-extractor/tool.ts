import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  bytes: readonly number[];
  start: number;
  width: number;
  littleEndian: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
  { id: "start", kind: "integer", label: "start" },
  { id: "width", kind: "integer", label: "width" },
  { id: "littleEndian", kind: "boolean", label: "littleEndian" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({
    checksum: String(H.wordValue(i.bytes, i.start, i.width, i.littleEndian)),
  });
};
export const example = {
  input: { bytes: [1, 2, 9], start: 0, width: 2, littleEndian: false },
  output: { result: { checksum: "258" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/checksum-field-extractor",
  title: "Checksum Field Extractor",
  description:
    "Extract a bounded unsigned checksum field from explicit bytes as decimal integer text with caller-selected byte order.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { checksum: { type: "string" } },
        required: ["checksum"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
