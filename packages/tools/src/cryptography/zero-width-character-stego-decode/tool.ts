import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, stego } from "../batch52-shared.js";
export type Input = Readonly<{ readonly encodedText: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "encodedText", label: "Encoded text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return { payloadHex: stego(i.encodedText, "zero", false) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { encodedText: "​‌​​​​​‌" },
  output: { result: { payloadHex: "41" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/zero-width-character-stego-decode",
  title: "Zero-Width Steganography Decoder",
  description:
    "Bounded lossless byte-hex steganographic decoder using U+200B/U+200C bits. No encryption, authentication or robustness to text normalization.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
