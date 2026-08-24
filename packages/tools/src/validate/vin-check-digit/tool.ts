import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VinCheckDigitInput = {
  readonly mode: "compute" | "validate";
  readonly vin: string;
};

export type VinCheckDigitOutput = {
  readonly computedCheckChar: string;
  readonly valid: boolean;
  readonly worldRegionHint: string;
};

const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2] as const;
const TRANSLITERATION: Readonly<Record<string, number>> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  P: 7,
  R: 9,
  S: 2,
  T: 3,
  U: 4,
  V: 5,
  W: 6,
  X: 7,
  Y: 8,
  Z: 9,
};

const regionFor = (character: string): string => {
  if (/^[A-H]$/.test(character)) return "Africa";
  if (/^[J-R]$/.test(character)) return "Asia";
  if (/^[S-Z]$/.test(character)) return "Europe";
  if (/^[1-5]$/.test(character)) return "North America";
  if (/^[6-7]$/.test(character)) return "Oceania";
  if (/^[8-9]$/.test(character)) return "South America";
  return "unknown/other";
};

export const calculateVinCheckDigit = (
  input: VinCheckDigitInput,
): VinCheckDigitOutput => {
  const vin = input.vin.trim().toUpperCase();
  if (!/^[A-HJ-NPR-Z0-9]+$/.test(vin))
    simpleError(
      "vin",
      "VIN characters must be digits or uppercase letters other than I, O, and Q.",
    );
  const expectedLength = input.mode === "validate" ? 17 : 16;
  if (vin.length !== expectedLength)
    simpleError(
      "vin",
      input.mode === "validate"
        ? "Validation mode requires all 17 VIN characters."
        : "Compute mode requires 16 characters with position 9 omitted.",
      "invalid_length",
    );
  const probe =
    input.mode === "validate" ? vin : `${vin.slice(0, 8)}0${vin.slice(8)}`;
  let sum = 0;
  for (let index = 0; index < WEIGHTS.length; index += 1) {
    const character = probe[index];
    const value = /^\d$/.test(character)
      ? Number(character)
      : TRANSLITERATION[character];
    sum += value * WEIGHTS[index];
  }
  const remainder = sum % 11;
  const computedCheckChar = remainder === 10 ? "X" : String(remainder);
  return {
    computedCheckChar,
    valid: input.mode === "compute" || vin[8] === computedCheckChar,
    worldRegionHint: regionFor(vin[0]),
  };
};

export const vinCheckDigitExample = {
  input: { mode: "validate", vin: "1M8GDM9AXKP042788" },
  output: {
    computedCheckChar: "X",
    valid: true,
    worldRegionHint: "North America",
  },
} satisfies ToolExample<VinCheckDigitInput, VinCheckDigitOutput>;

export const vinCheckDigitTool = createSimpleTool({
  calculate: (input) =>
    calculateVinCheckDigit({
      mode: input.mode as VinCheckDigitInput["mode"],
      vin: input.vin as string,
    }),
  description:
    "Validate the ISO 3779/North American VIN check character in position 9, or compute it from a 16-character VIN with that position omitted. The tool rejects forbidden letters instead of silently deleting them.",
  id: "validate/vin-check-digit",
  inputs: [
    {
      description: "Choose whether position 9 is present or omitted.",
      enum: ["validate", "compute"],
      id: "mode",
      kind: "string",
      label: "Mode",
    },
    {
      description:
        "17-character VIN for validation, or 16 characters with position 9 omitted for computation.",
      id: "vin",
      kind: "string",
      label: "VIN",
    },
  ],
  outputs: [
    {
      description:
        "Whether the supplied complete VIN has the calculated check character; true in compute mode.",
      id: "valid",
      kind: "boolean",
      label: "Valid?",
    },
    {
      description: "Calculated check character, 0–9 or X.",
      id: "computedCheckChar",
      kind: "string",
      label: "Check character",
    },
    {
      description:
        "Broad geographic region indicated by the first WMI character.",
      id: "worldRegionHint",
      kind: "string",
      label: "Region",
    },
  ],
  title: "VIN Check Digit Validator",
});
export const runVinCheckDigit = vinCheckDigitTool.execute;
export { vinCheckDigitExample as example };
export default vinCheckDigitTool;
