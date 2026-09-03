import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, squareCipher } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly callerSquareA: string;
  readonly callerSquareB: string;
  readonly decode: boolean;
}>;
export type Output = Readonly<{ readonly transformed: string }>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "callerSquareA", label: "Caller square a", kind: "string" },
  { id: "callerSquareB", label: "Caller square b", kind: "string" },
  { id: "decode", label: "Decode", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    transformed: squareCipher(
      input.text,
      input.callerSquareA,
      input.callerSquareB,
      false,
      input.decode,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "AB",
  callerSquareA: "ABCDEFGHIKLMNOPQRSTUVWXYZ",
  callerSquareB: "ABCDEFGHIKLMNOPQRSTUVWXYZ",
  decode: false,
} satisfies Input;
export const exampleOutput = { transformed: "BA" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/two-square-cipher",
  title: "Two-Square Cipher Tool",
  description:
    "Explicit horizontal two-square rectangle (same-row swaps, no special identity rule) digraph substitution. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "transformed", label: "Transformed", kind: "string" }],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      callerSquareA: value.callerSquareA as string,
      callerSquareB: value.callerSquareB as string,
      decode: value.decode as boolean,
    }),
});
export const run = tool.execute;
export default tool;
