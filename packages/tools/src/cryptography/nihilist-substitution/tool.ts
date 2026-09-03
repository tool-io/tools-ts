import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, letters, alphabet } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly key: string;
  readonly callerSquare: string;
}>;
export type Output = Readonly<{ readonly encodedNumbers: readonly number[] }>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "key", label: "Key", kind: "string" },
  { id: "callerSquare", label: "Caller square", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  alphabet(input.callerSquare, 25);
  letters(input.text, input.callerSquare);
  letters(input.key, input.callerSquare);
  if (!input.key.length)
    simpleError("key", "Explicit nonempty Nihilist key required.");
  const coordinate = (c: string) => {
    const n = input.callerSquare.indexOf(c);
    return 10 * (Math.floor(n / 5) + 1) + (n % 5) + 1;
  };
  return {
    encodedNumbers: [...input.text].map(
      (c, i) => coordinate(c) + coordinate(input.key[i % input.key.length]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "ABC",
  key: "BC",
  callerSquare: "ABCDEFGHIKLMNOPQRSTUVWXYZ",
} satisfies Input;
export const exampleOutput = { encodedNumbers: [23, 25, 25] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/nihilist-substitution",
  title: "Nihilist Substitution Tool",
  description:
    "Explicit Nihilist two-digit row/column numeric sum, no mod100 wrap or hidden J merging. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [
    { id: "encodedNumbers", label: "Encoded numbers", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      key: value.key as string,
      callerSquare: value.callerSquare as string,
    }),
});
export const run = tool.execute;
export default tool;
