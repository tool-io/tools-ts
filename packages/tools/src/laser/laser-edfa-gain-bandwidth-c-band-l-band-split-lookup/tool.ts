import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EdfaBandLookupInput = {
  readonly wavelengthNm?: number;
};

export type EdfaBandLookupOutput = {
  readonly bandName: string;
  readonly edfaSupport: string;
  readonly notes: string;
  readonly positionWithinBandPercent: number;
};

type BandRow = {
  readonly highNmExclusive: number;
  readonly lowNmInclusive: number;
  readonly name: string;
  readonly notes: string;
  readonly support: "standard-edfa" | "gain-shifted-edfa" | "not-covered";
};

const BANDS: readonly BandRow[] = [
  {
    highNmExclusive: 1530,
    lowNmInclusive: 1460,
    name: "S-band",
    notes:
      "S-band needs thulium-doped fiber amplifiers or Raman gain rather than a plain EDFA.",
    support: "not-covered",
  },
  {
    highNmExclusive: 1565,
    lowNmInclusive: 1530,
    name: "C-band",
    notes:
      "Workhorse EDFA gain band around the erbium 1530–1565 nm emission peak.",
    support: "standard-edfa",
  },
  {
    highNmExclusive: 1625,
    lowNmInclusive: 1565,
    name: "L-band",
    notes:
      "Gain-shifted erbium fibre with a longer coil and higher pump power extends amplification here.",
    support: "gain-shifted-edfa",
  },
];

export const lookupEdfaBand = (wavelengthNm: number): EdfaBandLookupOutput => {
  if (wavelengthNm <= 0)
    simpleError("wavelengthNm", "Wavelength must be positive.");
  const band = BANDS.find(
    (entry) =>
      wavelengthNm >= entry.lowNmInclusive &&
      wavelengthNm < entry.highNmExclusive,
  );
  if (!band)
    return {
      bandName: "outside-common-bands",
      edfaSupport: "not-covered",
      notes: "No common EDFA gain band covers this wavelength.",
      positionWithinBandPercent: -1,
    };
  const span = band.highNmExclusive - band.lowNmInclusive;
  return {
    bandName: band.name,
    edfaSupport: band.support,
    notes: band.notes,
    positionWithinBandPercent:
      ((wavelengthNm - band.lowNmInclusive) / span) * 100,
  };
};

export const edfaBandLookupExample = {
  input: { wavelengthNm: 1550 },
  output: lookupEdfaBand(1550),
} satisfies ToolExample<EdfaBandLookupInput, EdfaBandLookupOutput>;

export const edfaBandLookupTool = createSimpleTool({
  calculate: (input) => lookupEdfaBand(input.wavelengthNm as number),
  description:
    "Assign an optical telecom wavelength to its EDFA amplification band and report how well a standard amplifier covers it.",
  id: "laser/laser-edfa-gain-bandwidth-c-band-l-band-split-lookup",
  inputs: [
    {
      default: 1550,
      description: "Channel wavelength to classify.",
      id: "wavelengthNm",
      kind: "number",
      label: "Wavelength",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Amplification band that contains the wavelength.",
      id: "bandName",
      kind: "string",
      label: "Band",
    },
    {
      description: "How a standard EDFA supports this band.",
      id: "edfaSupport",
      kind: "string",
      label: "EDFA support",
    },
    {
      description: "Position inside the band from its lower edge.",
      id: "positionWithinBandPercent",
      kind: "number",
      label: "Position in band",
      unit: "%",
    },
    {
      description: "Practical remark for the band.",
      id: "notes",
      kind: "string",
      label: "Notes",
    },
  ],
  title: "EDFA C/L-Band Split Lookup",
});
export const runEdfaBandLookup = edfaBandLookupTool.execute;
export default edfaBandLookupTool;

export { edfaBandLookupExample as example };
