import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const speciesAccumulationCurveExample = {
  input: { effortUnits: 3, speciesAfterInt: 27, speciesBeforeInt: 12 },
  output: { accumulationRate: 5 },
} satisfies ToolExample<
  {
    readonly effortUnits: number;
    readonly speciesAfterInt: number;
    readonly speciesBeforeInt: number;
  },
  { readonly accumulationRate: number }
>;

export const speciesAccumulationCurveTool = createSimpleTool({
  id: "biology/species-accumulation-curve",
  title: "Accumulation Slope Segment",
  description:
    "Compute the species accumulation rate for one survey segment as new species divided by units of sampling effort.",
  inputs: [
    {
      id: "speciesBeforeInt",
      label: "Species before",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "speciesAfterInt",
      label: "Species after",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "effortUnits",
      label: "Sampling effort",
      kind: "number",
      unit: "units",
    },
  ],
  outputs: [
    {
      id: "accumulationRate",
      label: "New species per unit effort",
      kind: "number",
      unit: "species/unit",
    },
  ],
  calculate: (input) => {
    const speciesBeforeInt = input.speciesBeforeInt as number;
    const speciesAfterInt = input.speciesAfterInt as number;
    const effortUnits = input.effortUnits as number;
    if (effortUnits <= 0)
      simpleError("effortUnits", "Effort must be greater than zero.");
    if (speciesAfterInt < speciesBeforeInt)
      simpleError(
        "speciesAfterInt",
        "Species count after must not be lower than before.",
        "decreasing_curve",
      );
    return {
      accumulationRate: (speciesAfterInt - speciesBeforeInt) / effortUnits,
    };
  },
});
export const runSpeciesAccumulationCurve = speciesAccumulationCurveTool.execute;
export default speciesAccumulationCurveTool;
