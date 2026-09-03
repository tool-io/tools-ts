import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  keyOrder,
  transpose,
} from "../batch36-shared.js";
export type Input = Readonly<{ readonly text: string; readonly key: string }>;
export type Output = Readonly<{ readonly transformed: string }>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const order = keyOrder(input.key);
  return { transformed: transpose(input.text, input.key.length, order, true) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { text: "BDACE", key: "BA" } satisfies Input;
export const exampleOutput = { transformed: "ABCDE" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/columnar-transposition-decrypt",
  title: "Columnar Transposition Decryptor",
  description:
    "Ragged unpadded stable alphabetical key column transposition, row-major input, no fabricated cells. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "transformed", label: "Transformed", kind: "string" }],
  calculate: (value) =>
    calculate({ text: value.text as string, key: value.key as string }),
});
export const run = tool.execute;
export default tool;
