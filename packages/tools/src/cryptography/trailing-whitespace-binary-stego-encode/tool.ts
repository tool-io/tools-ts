import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, stego } from "../batch52-shared.js";
export type Input = Readonly<{ readonly payloadHex: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "payloadHex", label: "Payload hex", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return { encodedText: stego(i.payloadHex, "white", true) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { payloadHex: "41" },
  output: { result: { encodedText: " \n\t\n \n \n \n \n \n\t" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/trailing-whitespace-binary-stego-encode",
  title: "Whitespace Steganography Encoder",
  description:
    "Bounded lossless byte-hex steganographic encoder using one space/tab bit per line. No encryption, authentication or robustness to text normalization.",
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
