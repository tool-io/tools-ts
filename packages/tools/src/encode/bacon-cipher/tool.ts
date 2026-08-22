import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const baconCipherEncodeExample = {
  input: { oneSym: "b", text: "Hi", zeroSym: "a" },
  output: { encoded: "aabbb abaaa" },
} satisfies ToolExample<
  { readonly oneSym: string; readonly text: string; readonly zeroSym: string },
  { readonly encoded: string }
>;

export const calculateBaconCipherEncode = (
  input: BaconCipherEncodeInput,
): BaconCipherEncodeOutput => {
  if (
    [...input.zeroSym].length !== 1 ||
    [...input.oneSym].length !== 1 ||
    input.zeroSym === input.oneSym
  )
    simpleError(
      "zeroSym",
      "Choose two different single-character symbols.",
      "invalid_symbols",
    );
  const text = (input.text as string).toUpperCase().replace(/[^A-Z]/g, "");
  if (!text)
    simpleError("text", "Provide at least one letter A–Z.", "empty_text");
  return {
    encoded: [...text]
      .map((c) => {
        const v = c.charCodeAt(0) - 65;
        return [16, 8, 4, 2, 1]
          .map((bit) => (v & bit ? input.oneSym : input.zeroSym))
          .join("");
      })
      .join(" "),
  };
};

export type BaconCipherEncodeInput = {
  readonly text: string;
  readonly zeroSym: string;
  readonly oneSym: string;
};
export type BaconCipherEncodeOutput = { readonly encoded: string };

export const baconCipherEncodeTool = createSimpleTool({
  calculate: (input) =>
    calculateBaconCipherEncode(input as unknown as BaconCipherEncodeInput),
  description: "Encode letters A–Z into five-symbol Bacon cipher groups.",
  id: "encode/bacon-cipher",
  inputs: [
    { id: "text", kind: "string", label: "Text" },
    { id: "zeroSym", kind: "string", label: "Zero symbol" },
    { id: "oneSym", kind: "string", label: "One symbol" },
  ],
  outputs: [{ id: "encoded", kind: "string", label: "Encoded" }],
  title: "Bacon Cipher Encoder",
});
export const runBaconCipherEncode = baconCipherEncodeTool.execute;
export default baconCipherEncodeTool;
