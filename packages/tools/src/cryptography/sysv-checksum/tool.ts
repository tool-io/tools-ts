import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bytes } from "../batch36-shared.js";
export type Input = Readonly<{ readonly byteValues: readonly number[] }>;
export type Output = Readonly<{ readonly sysvSum16: number }>;
const inputFields = [
  { id: "byteValues", label: "Byte values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bytes(input.byteValues);
  let total = input.byteValues.reduce((s, b) => s + b, 0);
  total = (total & 65535) + (total >>> 16);
  total = (total & 65535) + (total >>> 16);
  return { sysvSum16: total };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { byteValues: [1, 2, 3] } satisfies Input;
export const exampleOutput = { sysvSum16: 6 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/sysv-checksum",
  title: "SysV Checksum",
  description:
    "Compute explicit sysvSum16 over caller bytes, bounded4096 bytes and no text encoding ambiguity; noncryptographic checksum does not establish authenticity.",
  inputs: inputFields,
  outputs: [{ id: "sysvSum16", label: "Sysv sum16", kind: "number" }],
  calculate: (value) =>
    calculate({ byteValues: value.byteValues as readonly number[] }),
});
export const run = tool.execute;
export default tool;
