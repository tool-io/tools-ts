import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, stego } from "../batch52-shared.js";
export type Input = Readonly<{ readonly payloadHex: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "payloadHex", label: "Payload hex", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return { encodedText: stego(i.payloadHex, "zero", true) };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { payloadHex: "41" },
  output: { result: { encodedText: "​‌​​​​​‌" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/zero-width-character-stego-encode",
  title: "Zero-Width Steganography Encoder",
  description:
    "Bounded lossless byte-hex steganographic encoder using U+200B/U+200C bits. No encryption, authentication or robustness to text normalization.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { encodedText: { type: "string" } },
        required: ["encodedText"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
