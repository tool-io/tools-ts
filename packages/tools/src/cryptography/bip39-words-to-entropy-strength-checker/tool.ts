import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly wordCount: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "wordCount", label: "Word count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  const bits = pick(
    String(i.wordCount),
    { "12": 128, "15": 160, "18": 192, "21": 224, "24": 256 },
    "words",
  );
  return {
    entropyBits: bits,
    checksumBits: bits / 32,
    totalEncodedBits: bits + bits / 32,
    validMnemonicVerified: false,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { wordCount: 12 },
  output: {
    result: {
      entropyBits: 128,
      checksumBits: 4,
      totalEncodedBits: 132,
      validMnemonicVerified: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/bip39-words-to-entropy-strength-checker",
  title: "BIP39 Words Entropy Strength Check",
  description:
    "BIP39 word count layout only; does not validate wordlist/checksum, randomness, recovery ownership or wallet safety.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          entropyBits: { type: "number" },
          checksumBits: { type: "number" },
          totalEncodedBits: { type: "number" },
          validMnemonicVerified: { type: "boolean" },
        },
        required: [
          "entropyBits",
          "checksumBits",
          "totalEncodedBits",
          "validMnemonicVerified",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
