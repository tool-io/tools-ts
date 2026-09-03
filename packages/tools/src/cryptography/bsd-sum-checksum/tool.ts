import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bytes } from "../batch36-shared.js";
export type Input = Readonly<{ readonly byteValues: readonly number[] }>;
export type Output = Readonly<{ readonly bsdSum16: number }>;
const inputFields = [
  { id: "byteValues", label: "Byte values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bytes(input.byteValues);
  let total = 0;
  for (const b of input.byteValues)
    total = (((total >>> 1) | ((total & 1) << 15)) + b) & 65535;
  return { bsdSum16: total };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { byteValues: [1, 2, 3] } satisfies Input;
export const exampleOutput = { bsdSum16: 16388 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/bsd-sum-checksum",
  title: "BSD Sum Checksum",
  description:
    "Compute explicit bsdSum16 over caller bytes, bounded4096 bytes and no text encoding ambiguity; noncryptographic checksum does not establish authenticity.",
  inputs: inputFields,
  outputs: [{ id: "bsdSum16", label: "Bsd sum16", kind: "number" }],
  calculate: (value) =>
    calculate({ byteValues: value.byteValues as readonly number[] }),
});
export const run = tool.execute;
export default tool;
