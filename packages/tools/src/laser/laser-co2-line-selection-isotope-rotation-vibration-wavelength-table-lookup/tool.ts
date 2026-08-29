import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Co2LineKey = "10P20" | "band-10p6" | "band-9p6";

export type Co2LineInput = {
  readonly line: Co2LineKey;
};

export type Co2LineOutput = {
  readonly wavelengthUm: number;
  readonly band: string;
  readonly isotopologue: string;
  readonly note: string;
};

/** Common regular-isotope CO2 laser lines (¹²C¹⁶O₂). */
export const CO2_LINES: Record<
  Co2LineKey,
  Omit<Co2LineOutput, "note"> & { note: string }
> = {
  "10P20": {
    wavelengthUm: 10.591,
    band: "00°1–10°0 P-branch (10.6 µm band)",
    isotopologue: "12C16O2",
    note: "A commonly used regular-isotope line in the nominal 10.6 µm band.",
  },
  "band-10p6": {
    wavelengthUm: 10.6,
    band: "00°1–10°0 band center (approximate)",
    isotopologue: "12C16O2",
    note: "Nominal 10.6 µm band center spanning the P/R rotational manifold.",
  },
  "band-9p6": {
    wavelengthUm: 9.6,
    band: "00°1–02°0 band center (approximate)",
    isotopologue: "12C16O2",
    note: "Nominal 9.6 µm hot-band-adjacent center; line-tunable within the manifold.",
  },
};

export const co2LineLookup = (input: Co2LineInput): Co2LineOutput => {
  const entry = CO2_LINES[input.line];
  if (!entry) simpleError("line", "Line must be a documented table entry.");
  return { ...entry };
};

export const co2LineExample = {
  input: { line: "10P20" },
  output: {
    wavelengthUm: 10.591,
    band: "00°1–10°0 P-branch (10.6 µm band)",
    isotopologue: "12C16O2",
    note: "A commonly used regular-isotope line in the nominal 10.6 µm band.",
  },
} satisfies ToolExample<Co2LineInput, Co2LineOutput>;

export const co2LineTool = createSimpleTool({
  calculate: (input) => co2LineLookup({ line: input.line as Co2LineKey }),
  description:
    "Look up common regular-isotope CO2 laser line wavelengths with band and isotopologue labels.",
  id: "laser/laser-co2-line-selection-isotope-rotation-vibration-wavelength-table-lookup",
  inputs: [
    {
      description: "Documented CO2 line or band-center key.",
      enum: ["10P20", "band-10p6", "band-9p6"],
      id: "line",
      kind: "string",
      label: "Line",
    },
  ],
  outputs: [
    {
      description: "Wavelength of the line (band centers approximate).",
      id: "wavelengthUm",
      kind: "number",
      label: "Wavelength",
      unit: "µm",
    },
    {
      description: "Vibrational band and branch assignment.",
      id: "band",
      kind: "string",
      label: "Band",
    },
    {
      description: "Isotopologue of the transition.",
      id: "isotopologue",
      kind: "string",
      label: "Isotopologue",
    },
    {
      description: "Selection guidance for the entry.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "CO2 Line Selection Table",
});
export const runCo2Line = co2LineTool.execute;
export default co2LineTool;

export { co2LineExample as example };
