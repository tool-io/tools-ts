import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

type IntensityEntry = {
  readonly effects: string;
  readonly name: string;
  readonly roman: string;
};

const MMI_SCALE: readonly IntensityEntry[] = [
  {
    effects:
      "Not felt except by very few under especially favorable conditions.",
    name: "Not felt",
    roman: "I",
  },
  {
    effects:
      "Felt only by a few persons at rest, especially on upper floors of buildings.",
    name: "Weak",
    roman: "II",
  },
  {
    effects:
      "Felt quite noticeably indoors, especially on upper floors; standing motor cars may rock slightly.",
    name: "Weak",
    roman: "III",
  },
  {
    effects:
      "Felt indoors by many, outdoors by few; windows, doors and dishes rattle; walls creak.",
    name: "Light",
    roman: "IV",
  },
  {
    effects:
      "Felt by nearly everyone; some dishes and windows broken; unstable objects overturned.",
    name: "Moderate",
    roman: "V",
  },
  {
    effects:
      "Felt by all; some heavy furniture moved; a few instances of fallen plaster and damaged chimneys.",
    name: "Strong",
    roman: "VI",
  },
  {
    effects:
      "Damage negligible in well-built structures; considerable in poorly built or badly designed structures.",
    name: "Very strong",
    roman: "VII",
  },
  {
    effects:
      "Slight damage in specially designed structures; considerable damage in ordinary buildings; chimneys fall.",
    name: "Severe",
    roman: "VIII",
  },
  {
    effects:
      "Considerable damage in specially designed structures; buildings shifted off foundations; ground cracked.",
    name: "Violent",
    roman: "IX",
  },
  {
    effects:
      "Most masonry and frame structures destroyed; rails bent; landslides and ground fissures.",
    name: "Extreme",
    roman: "X",
  },
  {
    effects:
      "Few masonry structures remain standing; bridges destroyed; broad fissures in the ground.",
    name: "Extreme",
    roman: "XI",
  },
  {
    effects:
      "Damage total; waves visible on ground surfaces; objects thrown into the air.",
    name: "Extreme",
    roman: "XII",
  },
];

export type SeismicIntensityMmiLookupInput = {
  readonly intensityLevel: number;
};

export type SeismicIntensityMmiLookupOutput = {
  readonly effectsDescription: string;
  readonly shakingName: string;
  readonly romanNumeral: string;
};

export const calculateSeismicIntensityMmiLookup = (
  input: SeismicIntensityMmiLookupInput,
): SeismicIntensityMmiLookupOutput => {
  if (!(
    Number.isInteger(input.intensityLevel) &&
    input.intensityLevel >= 1 &&
    input.intensityLevel <= 12
  ))
    simpleError(
      "intensityLevel",
      "Modified Mercalli intensity must be an integer from 1 to 12.",
      "invalid_intensity",
    );
  const entry = MMI_SCALE[input.intensityLevel - 1];
  return {
    effectsDescription: entry.effects,
    shakingName: entry.name,
    romanNumeral: entry.roman,
  };
};

export const seismicIntensityMmiLookupExample = {
  input: { intensityLevel: 6 },
  output: {
    effectsDescription:
      "Felt by all; some heavy furniture moved; a few instances of fallen plaster and damaged chimneys.",
    shakingName: "Strong",
    romanNumeral: "VI",
  },
} satisfies ToolExample<
  SeismicIntensityMmiLookupInput,
  SeismicIntensityMmiLookupOutput
>;

export const seismicIntensityMmiLookupTool = createSimpleTool({
  id: "geology/seismic-intensity-mmi-lookup",
  title: "Seismic Intensity MMI Lookup",
  description:
    "Look up the Modified Mercalli intensity (I-XII) shaking name and typical effects for a given integer intensity level.",
  inputs: [
    {
      description:
        "Modified Mercalli intensity level as an integer from 1 (I) to 12 (XII).",
      id: "intensityLevel",
      kind: "integer",
      label: "MMI level",
      maximum: 12,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Standard shaking-strength name for the level.",
      id: "shakingName",
      kind: "string",
      label: "Shaking",
    },
    {
      description: "Roman numeral of the intensity level.",
      id: "romanNumeral",
      kind: "string",
      label: "Roman numeral",
    },
    {
      description: "Typical observed effects at this intensity.",
      id: "effectsDescription",
      kind: "string",
      label: "Effects",
    },
  ],
  calculate: (input) =>
    calculateSeismicIntensityMmiLookup(
      input as unknown as SeismicIntensityMmiLookupInput,
    ),
});

export const runSeismicIntensityMmiLookup =
  seismicIntensityMmiLookupTool.execute;
export default seismicIntensityMmiLookupTool;
