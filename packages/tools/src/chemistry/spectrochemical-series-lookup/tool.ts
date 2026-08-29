import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const LIGANDS_WEAK_TO_STRONG = [
  "I-",
  "Br-",
  "Cl-",
  "NO3-",
  "F-",
  "OH-",
  "H2O",
  "pyridine",
  "NH3",
  "NO2-",
  "CN-",
  "CO",
] as const;
const ALIASES: Readonly<Record<string, string>> = {
  ammonia: "NH3",
  bromide: "Br-",
  chloride: "Cl-",
  cyanide: "CN-",
  fluoride: "F-",
  hydroxide: "OH-",
  iodide: "I-",
  nitrate: "NO3-",
  nitrite: "NO2-",
  py: "pyridine",
  water: "H2O",
};

const normalizeLigand = (value: unknown): string => {
  const raw = String(value).trim().replace(/−/gu, "-").replace(/\s+/gu, "");
  return (
    ALIASES[raw.toLowerCase()] ??
    LIGANDS_WEAK_TO_STRONG.find(
      (ligand) => ligand.toLowerCase() === raw.toLowerCase(),
    ) ??
    raw
  );
};

export const spectrochemicalSeriesLookupTool = createSimpleTool({
  id: "chemistry/spectrochemical-series-lookup",
  title: "Spectrochemical Series Lookup",
  description:
    "Find a ligand's position in an abbreviated spectrochemical series ordered from weak-field to strong-field ligands.",
  inputs: [
    {
      description:
        "Ligand formula or common name, such as Cl-, H2O, ammonia, or CN-.",
      id: "ligand",
      kind: "string",
      label: "Ligand",
    },
  ],
  outputs: [
    {
      description: "One-based position from weakest to strongest field.",
      id: "weakToStrongRank",
      kind: "integer",
      label: "Weak-to-strong rank",
    },
    {
      description: "Canonical ligand notation used in the series.",
      id: "canonicalLigand",
      kind: "string",
      label: "Ligand notation",
    },
  ],
  calculate: (input) => {
    const canonicalLigand = normalizeLigand(input.ligand);
    const index = LIGANDS_WEAK_TO_STRONG.indexOf(
      canonicalLigand as (typeof LIGANDS_WEAK_TO_STRONG)[number],
    );
    if (index < 0)
      simpleError(
        "ligand",
        "The ligand is not in the abbreviated spectrochemical series.",
        "not_found",
      );
    return { canonicalLigand, weakToStrongRank: index + 1 };
  },
});
export default spectrochemicalSeriesLookupTool;
export const runSpectrochemicalSeriesLookup =
  spectrochemicalSeriesLookupTool.execute;

export type SpectrochemicalSeriesLookupInput = { readonly ligand: string };
export type SpectrochemicalSeriesLookupOutput = {
  readonly canonicalLigand: string;
  readonly weakToStrongRank: number;
};

export const spectrochemicalSeriesLookupExample = {
  input: { ligand: "water" },
  output: { canonicalLigand: "H2O", weakToStrongRank: 7 },
} satisfies ToolExample<
  SpectrochemicalSeriesLookupInput,
  SpectrochemicalSeriesLookupOutput
>;
