import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, letters, mod } from "../batch36-shared.js";
export type Input = Readonly<{ readonly text: string; readonly key: string }>;
export type Output = Readonly<{ readonly encoded: string }>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  letters(input.text);
  letters(input.key);
  if (!input.key.length) simpleError("key", "Nonempty explicit key required.");
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return {
    encoded: [...input.text]
      .map((c, i) => {
        const x = A.indexOf(c),
          k = A.indexOf(input.key[i % input.key.length]);
        return A[
          mod(
            x < 13
              ? 13 + mod(x + Math.floor(k / 2), 13)
              : mod(x - 13 - Math.floor(k / 2), 13),
          )
        ];
      })
      .join(""),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { text: "ABC", key: "ABC" } satisfies Input;
export const exampleOutput = { encoded: "NOQ" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/porta-cipher",
  title: "Porta Cipher Tool",
  description:
    "Apply Porta explicit uppercase key convention. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [{ id: "encoded", label: "Encoded", kind: "string" }],
  calculate: (value) =>
    calculate({ text: value.text as string, key: value.key as string }),
});
export const run = tool.execute;
export default tool;
