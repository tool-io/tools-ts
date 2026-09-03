import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  letters,
  alphabet,
  keyOrder,
  transpose,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly callerSquare: string;
  readonly key: string;
}>;
export type Output = Readonly<{ readonly encoded: string }>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "callerSquare", label: "Caller square", kind: "string" },
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  alphabet(input.callerSquare, 25);
  letters(input.text, input.callerSquare);
  const labels = "ADFGX",
    stream = [...input.text]
      .map((c) => {
        const i = input.callerSquare.indexOf(c);
        return labels[Math.floor(i / 5)] + labels[i % 5];
      })
      .join("");
  return {
    encoded: transpose(stream, input.key.length, keyOrder(input.key), false),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "ABC",
  callerSquare: "ABCDEFGHIKLMNOPQRSTUVWXYZ",
  key: "BA",
} satisfies Input;
export const exampleOutput = { encoded: "ADFAAA" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/adfgx-cipher",
  title: "AD FGX Cipher Tool",
  description:
    "Explicit AD FGX caller-square coordinate substitution then stable keyed ragged column transposition. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "encoded", label: "Encoded", kind: "string" }],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      callerSquare: value.callerSquare as string,
      key: value.key as string,
    }),
});
export const run = tool.execute;
export default tool;
