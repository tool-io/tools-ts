import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { waterAbsorptionAt } from "../laser-thulium-holmium-two-micron-water-absorption-cutting-depth-table/tool.js";

export type TwoMicronSource = "tm-fiber-1908" | "ho-yag-2090";

export type ThuliumHolmiumCascadeInput = {
  readonly source: TwoMicronSource;
};

export type ThuliumHolmiumCascadeOutput = {
  readonly wavelengthNm: number;
  readonly sourceType: string;
  readonly waterAbsorptionCoefficientPerCm: number;
  readonly penetrationDepthUm: number;
  readonly note: string;
};

const SOURCES: Record<
  TwoMicronSource,
  { readonly wavelengthNm: number; readonly sourceType: string }
> = {
  "tm-fiber-1908": { wavelengthNm: 1908, sourceType: "thulium fiber" },
  "ho-yag-2090": { wavelengthNm: 2090, sourceType: "holmium:YAG" },
};

/** Compare two source wavelengths using the repository's water table. */
export const thuliumHolmiumCascade = (
  input: ThuliumHolmiumCascadeInput,
): ThuliumHolmiumCascadeOutput => {
  const entry = SOURCES[input.source];
  if (!entry)
    simpleError("source", "Source must be tm-fiber-1908 or ho-yag-2090.");
  const { alphaPerCm } = waterAbsorptionAt(entry.wavelengthNm);
  const penetrationDepthUm = 10000 / alphaPerCm;
  if (!Number.isFinite(penetrationDepthUm))
    simpleError("source", "Penetration depth overflowed.");
  return {
    wavelengthNm: entry.wavelengthNm,
    sourceType: entry.sourceType,
    waterAbsorptionCoefficientPerCm: alphaPerCm,
    penetrationDepthUm,
    note: "The 1/µa value is a water-only optical penetration estimate, not a treatment recommendation or a prediction of ablation, coagulation, or total tissue injury depth.",
  };
};

export const thuliumHolmiumCascadeExample = {
  input: { source: "ho-yag-2090" },
  output: {
    wavelengthNm: 2090,
    sourceType: "holmium:YAG",
    waterAbsorptionCoefficientPerCm: 30,
    penetrationDepthUm: 333.3333333333333,
    note: "The 1/µa value is a water-only optical penetration estimate, not a treatment recommendation or a prediction of ablation, coagulation, or total tissue injury depth.",
  },
} satisfies ToolExample<
  ThuliumHolmiumCascadeInput,
  ThuliumHolmiumCascadeOutput
>;

export const thuliumHolmiumCascadeTool = createSimpleTool({
  calculate: (input) =>
    thuliumHolmiumCascade({ source: input.source as TwoMicronSource }),
  description:
    "Compare nominal 1908 nm thulium-fiber and 2090 nm holmium:YAG sources using tabulated water absorption and the corresponding 1/µa penetration estimate.",
  id: "laser/laser-thulium-fiber-1908-nm-holmium-cascade-hard-tissue-lookup",
  inputs: [
    {
      description: "Two-micron laser source to inspect.",
      enum: ["tm-fiber-1908", "ho-yag-2090"],
      id: "source",
      kind: "string",
      label: "Source",
    },
  ],
  outputs: [
    {
      description: "Nominal source wavelength.",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      unit: "nm",
    },
    {
      description: "Laser gain-medium family.",
      id: "sourceType",
      kind: "string",
      label: "Source type",
    },
    {
      description: "Tabulated water absorption coefficient at the wavelength.",
      id: "waterAbsorptionCoefficientPerCm",
      kind: "number",
      label: "Water absorption",
      unit: "cm^-1",
    },
    {
      description: "Water-only optical penetration estimate 1/µa.",
      id: "penetrationDepthUm",
      kind: "number",
      label: "Penetration depth",
      unit: "µm",
    },
    {
      description: "Scope and safety limitation for interpreting the value.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Thulium/Holmium Water Absorption Lookup",
});
export const runThuliumHolmiumCascade = thuliumHolmiumCascadeTool.execute;
export default thuliumHolmiumCascadeTool;

export { thuliumHolmiumCascadeExample as example };
