import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bytes } from "../batch36-shared.js";
export type Input = Readonly<{ readonly byteValues: readonly number[] }>;
export type Output = Readonly<{ readonly xorByteChecksum: number }>;
const inputFields = [
  { id: "byteValues", label: "Byte values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bytes(input.byteValues);
  let total = input.byteValues.reduce((s, b) => s ^ b, 0);
  return { xorByteChecksum: total };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { byteValues: [1, 2, 3] } satisfies Input;
export const exampleOutput = { xorByteChecksum: 0 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/xor-byte-checksum",
  title: "XOR Byte Checksum",
  description:
    "Compute explicit xorByteChecksum over caller bytes, bounded4096 bytes and no text encoding ambiguity; noncryptographic checksum does not establish authenticity.",
  inputs: inputFields,
  outputs: [
    { id: "xorByteChecksum", label: "Xor byte checksum", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ byteValues: value.byteValues as readonly number[] }),
});
export const run = tool.execute;
export default tool;
