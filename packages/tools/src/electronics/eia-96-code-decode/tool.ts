import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const EIA96: readonly number[] = [
  100, 102, 105, 107, 110, 113, 115, 118, 121, 124, 127, 130, 133, 137, 140,
  143, 147, 150, 154, 158, 162, 165, 169, 174, 178, 182, 187, 191, 196, 200,
  205, 210, 215, 221, 226, 232, 237, 243, 249, 255, 261, 267, 274, 280, 287,
  294, 301, 309, 316, 324, 332, 340, 348, 357, 365, 374, 383, 392, 402, 412,
  422, 432, 442, 453, 464, 475, 487, 499, 511, 523, 536, 549, 562, 576, 590,
  604, 619, 634, 649, 665, 681, 698, 715, 732, 750, 768, 787, 806, 825, 845,
  866, 887, 909, 931, 953, 976,
];

const MULTIPLIERS: Record<string, number> = {
  S: 0.01,
  H: 0.1,
  R: 1,
  X: 10,
  A: 100,
  B: 1000,
  C: 10000,
  D: 100000,
  E: 1000000,
  F: 10000000,
};

export const eia96CodeDecodeExample = {
  input: { code: "24B" },
  output: { resistanceOhms: 174000 },
} satisfies ToolExample<
  { readonly code: string },
  { readonly resistanceOhms: number }
>;

export const eia96CodeDecodeTool = createSimpleTool({
  id: "electronics/eia-96-code-decode",
  title: "EIA-96 Decode",
  description:
    "Decode a two-digit EIA-96 base value plus multiplier letter into resistance in ohms.",
  inputs: [{ id: "code", kind: "string", label: "EIA-96 code" }],
  outputs: [
    { id: "resistanceOhms", kind: "number", label: "Resistance", unit: "Ω" },
  ],
  calculate: (input) => {
    const code = input.code as string;
    if (!/^\d{2}[SHRXABCDEF]$/.test(code))
      simpleError(
        "code",
        "The EIA-96 code must be two digits followed by a multiplier letter.",
        "invalid_code",
      );
    const digitCode = Number(code.slice(0, 2));
    if (digitCode < 1 || digitCode > 96)
      simpleError(
        "code",
        "The EIA-96 digit code must be between 01 and 96.",
        "invalid_code",
      );
    return {
      resistanceOhms:
        EIA96[digitCode - 1] * MULTIPLIERS[code[2] as keyof typeof MULTIPLIERS],
    };
  },
});
export const runEia96CodeDecode = eia96CodeDecodeTool.execute;
export default eia96CodeDecodeTool;
