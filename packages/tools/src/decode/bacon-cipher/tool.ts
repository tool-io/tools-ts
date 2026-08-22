import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const baconCipherDecodeExample = {
  input: { encoded: "aabbb ababa", oneSym: "b", zeroSym: "a" },
  output: { text: "HK" },
} satisfies ToolExample<
  {
    readonly encoded: string;
    readonly oneSym: string;
    readonly zeroSym: string;
  },
  { readonly text: string }
>;

export const calculateBaconCipherDecode = (
  input: BaconCipherDecodeInput,
): BaconCipherDecodeOutput => {
  const { encoded, oneSym, zeroSym } = input;
  if (
    [...zeroSym].length !== 1 ||
    [...oneSym].length !== 1 ||
    oneSym === zeroSym
  )
    simpleError(
      "oneSym",
      "Choose two different single-character symbols.",
      "invalid_symbols",
    );
  const groups = encoded.trim().split(/\s+/);
  const decoded = groups
    .map((g) => {
      if (g.length !== 5 || [...g].some((c) => c !== oneSym && c !== zeroSym))
        simpleError(
          "encoded",
          "Each group must be five zero/one symbols.",
          "invalid_group",
        );
      let v = 0;
      for (let i = 0; i < 5; i++) if (g[i] === oneSym) v |= 16 >> i;
      if (v > 25)
        simpleError(
          "encoded",
          "Five-symbol groups must encode values from A through Z.",
          "invalid_group",
        );
      return String.fromCharCode(65 + v);
    })
    .join("");
  return { text: decoded };
};

export type BaconCipherDecodeInput = {
  readonly encoded: string;
  readonly oneSym: string;
  readonly zeroSym: string;
};
export type BaconCipherDecodeOutput = { readonly text: string };

export const baconCipherDecodeTool = createSimpleTool({
  calculate: (input) =>
    calculateBaconCipherDecode(input as unknown as BaconCipherDecodeInput),
  description: "Decode five-symbol Bacon cipher groups back into letters A–Z.",
  id: "decode/bacon-cipher",
  inputs: [
    { id: "encoded", kind: "string", label: "Encoded" },
    { default: "b", id: "oneSym", kind: "string", label: "One symbol" },
    { default: "a", id: "zeroSym", kind: "string", label: "Zero symbol" },
  ],
  outputs: [{ id: "text", kind: "string", label: "Text" }],
  title: "Bacon Cipher Decoder",
});
export const runBaconCipherDecode = baconCipherDecodeTool.execute;
export default baconCipherDecodeTool;
