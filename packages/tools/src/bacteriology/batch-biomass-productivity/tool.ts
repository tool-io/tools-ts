import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly initialBiomassGramsPerLiter: number;
  readonly finalBiomassGramsPerLiter: number;
  readonly cultureVolumeLiters: number;
  readonly elapsedHours: number;
}>;
export type Output = Readonly<{
  readonly netBiomassGrams: number;
  readonly volumetricProductivityGramsPerLiterHour: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.initialBiomassGramsPerLiter, "initialBiomassGramsPerLiter");
  nonnegative(input.finalBiomassGramsPerLiter, "finalBiomassGramsPerLiter");
  positive(input.cultureVolumeLiters, "cultureVolumeLiters");
  positive(input.elapsedHours, "elapsedHours");
  if (input.finalBiomassGramsPerLiter < input.initialBiomassGramsPerLiter)
    simpleError(
      "finalBiomassGramsPerLiter",
      "This production model requires nondecreasing biomass concentration.",
    );
  const gain =
    input.finalBiomassGramsPerLiter - input.initialBiomassGramsPerLiter;
  return {
    netBiomassGrams: gain * input.cultureVolumeLiters,
    volumetricProductivityGramsPerLiterHour: gain / input.elapsedHours,
  };
};
export const exampleInput = {
  initialBiomassGramsPerLiter: 1,
  finalBiomassGramsPerLiter: 5,
  cultureVolumeLiters: 2,
  elapsedHours: 2,
} satisfies Input;
export const exampleOutput = {
  netBiomassGrams: 8,
  volumetricProductivityGramsPerLiterHour: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/batch-biomass-productivity",
  title: "Batch Biomass Productivity",
  description:
    "Compute net biomass production and volumetric productivity in a constant-volume batch culture.",
  inputs: [
    {
      id: "initialBiomassGramsPerLiter",
      label: "Initial biomass grams per liter",
      kind: "number",
      minimum: 0,
    },
    {
      id: "finalBiomassGramsPerLiter",
      label: "Final biomass grams per liter",
      kind: "number",
      minimum: 0,
    },
    {
      id: "cultureVolumeLiters",
      label: "Culture volume liters",
      kind: "number",
    },
    { id: "elapsedHours", label: "Elapsed hours", kind: "number" },
  ],
  outputs: [
    { id: "netBiomassGrams", label: "Net biomass grams", kind: "number" },
    {
      id: "volumetricProductivityGramsPerLiterHour",
      label: "Volumetric productivity grams per liter hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialBiomassGramsPerLiter: value.initialBiomassGramsPerLiter as number,
      finalBiomassGramsPerLiter: value.finalBiomassGramsPerLiter as number,
      cultureVolumeLiters: value.cultureVolumeLiters as number,
      elapsedHours: value.elapsedHours as number,
    }),
});
export const run = tool.execute;
export default tool;
