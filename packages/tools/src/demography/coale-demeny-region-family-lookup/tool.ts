import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CoaleDemenyRegionFamilyLookupInput = {
  readonly family: "west" | "north" | "east" | "south";
  readonly level: number;
};

export type CoaleDemenyRegionFamilyLookupOutput = {
  readonly patternCode: string;
  readonly modelLabel: string;
};

const FAMILY_CODE = {
  west: "W",
  north: "N",
  east: "E",
  south: "S",
} as const;

const FAMILY_NAME = {
  west: "West",
  north: "North",
  east: "East",
  south: "South",
} as const;

export const calculateCoaleDemenyRegionFamilyLookup = (
  input: CoaleDemenyRegionFamilyLookupInput,
): CoaleDemenyRegionFamilyLookupOutput => {
  if (!(
    Number.isSafeInteger(input.level) &&
    input.level >= 1 &&
    input.level <= 25
  ))
    simpleError(
      "level",
      "Coale-Demeny mortality levels run from 1 to 25.",
      "invalid_level",
    );
  const code = FAMILY_CODE[input.family];
  return {
    patternCode: code,
    modelLabel: `Coale-Demeny ${FAMILY_NAME[input.family]} Level ${input.level}`,
  };
};

export const coaleDemenyRegionFamilyLookupExample = {
  input: { family: "west", level: 21 },
  output: { patternCode: "W", modelLabel: "Coale-Demeny West Level 21" },
} satisfies ToolExample<
  CoaleDemenyRegionFamilyLookupInput,
  CoaleDemenyRegionFamilyLookupOutput
>;

export const coaleDemenyRegionFamilyLookupTool = createSimpleTool({
  id: "demography/coale-demeny-region-family-lookup",
  title: "Coale Demeny Region Family Lookup",
  description:
    "Validate and label a Coale-Demeny regional model life table family (West, North, East or South) at a mortality level from 1 to 25.",
  inputs: [
    {
      description: "Regional family of the model life tables.",
      enum: ["west", "north", "east", "south"],
      id: "family",
      kind: "string",
      label: "Family",
    },
    {
      description: "Mortality level from 1 (highest mortality) to 25 (lowest).",
      id: "level",
      kind: "integer",
      label: "Level",
      maximum: 25,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Canonical single-letter family code.",
      enum: ["W", "N", "E", "S"],
      id: "patternCode",
      kind: "string",
      label: "Code",
    },
    {
      description: "Full model life table label.",
      id: "modelLabel",
      kind: "string",
      label: "Model",
    },
  ],
  calculate: (input) =>
    calculateCoaleDemenyRegionFamilyLookup(
      input as unknown as CoaleDemenyRegionFamilyLookupInput,
    ),
});

export const runCoaleDemenyRegionFamilyLookup =
  coaleDemenyRegionFamilyLookupTool.execute;
export default coaleDemenyRegionFamilyLookupTool;
