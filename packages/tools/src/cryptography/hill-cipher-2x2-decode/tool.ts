import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, hill } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly keyMatrix: readonly (readonly number[])[];
}>;
export type Output = Readonly<{ readonly transformed: string }>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "keyMatrix", label: "Key matrix", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return { transformed: hill(input.text, input.keyMatrix, true) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "HIAT",
  keyMatrix: [
    [3, 3],
    [2, 5],
  ],
} satisfies Input;
export const exampleOutput = { transformed: "HELP" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/hill-cipher-2x2-decode",
  title: "Hill 2×2 Cipher Decoder",
  description:
    "Explicit invertible2×2 Hill decoding of column digraph vectors mod 26. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "transformed", label: "Transformed", kind: "string" }],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      keyMatrix: value.keyMatrix as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
