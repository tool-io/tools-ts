import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  framesJson: string;
  lengthBytes: number;
  littleEndian: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "framesJson", kind: "string", label: "framesJson" },
  { id: "lengthBytes", kind: "integer", label: "lengthBytes" },
  { id: "littleEndian", kind: "boolean", label: "littleEndian" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.lengthBytes, 1, 4);
  const frames = H.arr(i.framesJson).map((v) => {
    H.check(Array.isArray(v));
    H.bytes(v as number[]);
    return v as number[];
  });
  const bytes = frames.flatMap((v) => [
    ...H.wordBytes(BigInt(v.length), i.lengthBytes, i.littleEndian),
    ...v,
  ]);
  H.check(bytes.length <= 128);
  return H.finish({ bytes });
};
export const example = {
  input: { framesJson: "[[1,2],[3]]", lengthBytes: 1, littleEndian: false },
  output: { result: { bytes: [2, 1, 2, 1, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/length-field-frame-join",
  title: "Length Field Frame Joiner",
  description:
    "Join bounded byte payload frames with explicit unsigned length prefixes and byte order; output stream is limited to 128 bytes.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
