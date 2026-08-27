import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const speciesAccumulationRarefiedExample = {
  input: { sampleInt: 50, speciesTotalInt: 20, totalIndividualsInt: 100 },
  output: { rarefiedSpeciesCount: 10 },
} satisfies ToolExample<
  {
    readonly sampleInt: number;
    readonly speciesTotalInt: number;
    readonly totalIndividualsInt: number;
    readonly halfSaturationInt?: number;
  },
  { readonly rarefiedSpeciesCount: number }
>;

export const speciesAccumulationRarefiedTool = createSimpleTool({
  id: "biology/species-accumulation-rarefied",
  title: "Rarefied Species Curve Point",
  description:
    "Estimate a rarefied species count with a documented half-saturation form: species total times sample over sample plus half-saturation, where the half-saturation defaults to the total individual count rounded up to its half.",
  inputs: [
    {
      id: "speciesTotalInt",
      label: "Species total",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "totalIndividualsInt",
      label: "Total individuals",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "sampleInt",
      label: "Sample individuals",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "halfSaturationInt",
      label: "Half saturation",
      description:
        "Optional integer half-saturation constant; defaults to ceil(total individuals / 2).",
      kind: "integer",
      minimum: 1,
      required: false,
    },
  ],
  outputs: [
    {
      id: "rarefiedSpeciesCount",
      label: "Rarefied species count",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const speciesTotalInt = input.speciesTotalInt as number;
    const totalIndividualsInt = input.totalIndividualsInt as number;
    const sampleInt = input.sampleInt as number;
    const halfSaturationInt =
      input.halfSaturationInt === undefined
        ? Math.ceil(totalIndividualsInt / 2)
        : (input.halfSaturationInt as number);
    if (sampleInt > totalIndividualsInt)
      simpleError(
        "sampleInt",
        "The sample cannot exceed the total individual count.",
        "oversample",
      );
    return {
      rarefiedSpeciesCount:
        (speciesTotalInt * sampleInt) / (sampleInt + halfSaturationInt),
    };
  },
});
export const runSpeciesAccumulationRarefied =
  speciesAccumulationRarefiedTool.execute;
export default speciesAccumulationRarefiedTool;
