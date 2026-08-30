import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BiomasSingleTreeInput = Readonly<{
  readonly stemVolumeCubicMeters: number;
  readonly basicDensityKgPerCubicMeter: number;
  readonly expansionFactor: number;
}>;
export type BiomasSingleTreeOutput = Readonly<{
  readonly biomassKilograms: number;
}>;

export const calculateBiomasSingleTree = (
  x: BiomasSingleTreeInput,
): BiomasSingleTreeOutput => {
  if (!Number.isFinite(x.stemVolumeCubicMeters) || x.stemVolumeCubicMeters < 0)
    simpleError(
      "stemVolumeCubicMeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.basicDensityKgPerCubicMeter) ||
    x.basicDensityKgPerCubicMeter <= 0
  )
    simpleError(
      "basicDensityKgPerCubicMeter",
      "Provide a finite positive number.",
    );
  if (!Number.isFinite(x.expansionFactor) || x.expansionFactor <= 0)
    simpleError("expansionFactor", "Provide a finite positive number.");
  const biomassKilograms =
    x.stemVolumeCubicMeters * x.basicDensityKgPerCubicMeter * x.expansionFactor;
  if (!Number.isFinite(biomassKilograms))
    simpleError(
      "biomassKilograms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    biomassKilograms: Object.is(biomassKilograms, -0) ? 0 : biomassKilograms,
  };
};

export const example = {
  input: {
    stemVolumeCubicMeters: 1,
    basicDensityKgPerCubicMeter: 500,
    expansionFactor: 1.2,
  },
  output: { biomassKilograms: 600 },
} satisfies ToolExample<BiomasSingleTreeInput, BiomasSingleTreeOutput>;

export const tool = createSimpleTool({
  id: "forestry/biomas-single-tree",
  title: "Biomas Single Tree",
  description:
    "Dry aboveground tree biomass from measured stem volume, basic wood density and an explicit biomass expansion factor.",
  inputs: [
    {
      id: "stemVolumeCubicMeters",
      kind: "number",
      label: "Stem Volume Cubic Meters",
      unit: "m3",
      minimum: 0,
    },
    {
      id: "basicDensityKgPerCubicMeter",
      kind: "number",
      label: "Basic Density Kg Per Cubic Meter",
      unit: "kg/m3",
      minimum: 0,
    },
    {
      id: "expansionFactor",
      kind: "number",
      label: "Expansion Factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "biomassKilograms",
      kind: "number",
      label: "Biomass Kilograms",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateBiomasSingleTree({
      stemVolumeCubicMeters: input.stemVolumeCubicMeters as number,
      basicDensityKgPerCubicMeter: input.basicDensityKgPerCubicMeter as number,
      expansionFactor: input.expansionFactor as number,
    }),
});
export const biomasSingleTreeTool = tool;
export const runBiomasSingleTree = tool.execute;
export default tool;
