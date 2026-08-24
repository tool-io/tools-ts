import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EyeSafetyBand = {
  readonly lowNm: number;
  readonly highNm: number;
  readonly region: string;
  readonly reachesRetina: boolean;
  readonly note: string;
};

/** Wavelength bands and which part of the eye absorbs them. */
export const EYE_SAFETY_BANDS: readonly EyeSafetyBand[] = [
  {
    highNm: 400,
    lowNm: 180,
    note: "UV photons are absorbed by the cornea and crystalline lens.",
    reachesRetina: false,
    region: "cornea and lens (UV)",
  },
  {
    highNm: 1400,
    lowNm: 400,
    note: "Radiation focuses onto the retina — the most hazardous spectral region.",
    reachesRetina: true,
    region: "retina (visible & near-IR)",
  },
  {
    highNm: 3000,
    lowNm: 1400,
    note: "Water in the cornea and vitreous absorbs strongly; commonly marketed as 'eye-safe', though high power still damages the cornea and skin.",
    reachesRetina: false,
    region: "anterior segment (IR-B) — the 'eye-safe' band",
  },
  {
    highNm: 100000,
    lowNm: 3000,
    note: "Absorbed within the first tens of micrometers of tissue.",
    reachesRetina: false,
    region: "cornea surface (IR-C)",
  },
];

export type ErEyeSafeClassificationInput = {
  readonly wavelengthNm?: number;
};

export type ErEyeSafeClassificationOutput = {
  readonly reachesRetina: boolean;
  readonly hazardRegion: string;
  readonly eyeSafeLabelCommonlyUsed: boolean;
  readonly safetyNote: string;
};

export const classifyEyeSafetyBand = (
  wavelengthNm: number,
): ErEyeSafeClassificationOutput => {
  if (wavelengthNm <= 0)
    simpleError("wavelengthNm", "Wavelength must be positive.");
  if (wavelengthNm < 180 || wavelengthNm > 100000)
    simpleError(
      "wavelengthNm",
      "Wavelength must be within the 180–100000 nm classification table.",
    );
  const band = EYE_SAFETY_BANDS.find(
    (entry, index) =>
      wavelengthNm >= entry.lowNm &&
      (wavelengthNm < entry.highNm ||
        (index === EYE_SAFETY_BANDS.length - 1 &&
          wavelengthNm <= entry.highNm)),
  );
  if (!band)
    return simpleError(
      "wavelengthNm",
      "No ocular band covers this wavelength.",
    );
  const eyeSafeLabelCommonlyUsed =
    !band.reachesRetina && band.lowNm >= 1400 && band.highNm <= 3000;
  return {
    reachesRetina: band.reachesRetina,
    hazardRegion: band.region,
    eyeSafeLabelCommonlyUsed,
    safetyNote: band.note,
  };
};

export const erEyeSafeClassificationExample = {
  input: { wavelengthNm: 1550 },
  output: classifyEyeSafetyBand(1550),
} satisfies ToolExample<
  ErEyeSafeClassificationInput,
  ErEyeSafeClassificationOutput
>;

export const erEyeSafeClassificationTool = createSimpleTool({
  calculate: (input) => classifyEyeSafetyBand(input.wavelengthNm as number),
  description:
    "Classify a wavelength by the ocular tissue that absorbs it and explain why 1550 nm Er-fiber light carries the 'eye-safe' label.",
  id: "laser/laser-er-fiber-1550-eye-safe-retina-transmission-safety-class-note",
  inputs: [
    {
      default: 1550,
      description: "Wavelength to classify.",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      maximum: 100000,
      minimum: 180,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Whether the wavelength reaches the retina.",
      id: "reachesRetina",
      kind: "boolean",
      label: "Reaches retina",
    },
    {
      description: "Ocular tissue that absorbs the radiation.",
      id: "hazardRegion",
      kind: "string",
      label: "Hazard region",
    },
    {
      description: "Whether the 'eye-safe' marketing label applies.",
      id: "eyeSafeLabelCommonlyUsed",
      kind: "boolean",
      label: "Eye-safe label",
    },
    {
      description: "Absorption explanation for the band.",
      id: "safetyNote",
      kind: "string",
      label: "Safety note",
    },
  ],
  title: "Er-Fiber Eye-Safety Classification",
});
export const runErEyeSafeClassification = erEyeSafeClassificationTool.execute;
export default erEyeSafeClassificationTool;

export { erEyeSafeClassificationExample as example };
