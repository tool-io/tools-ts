import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StomatalDensityInput = {
  readonly fieldAreaMm2: number;
  readonly stomataCountedInt: number;
};

export type StomatalDensityOutput = {
  readonly stomatalDensityPerMm2: number;
};

export const stomatalDensityExample = {
  input: { fieldAreaMm2: 0.25, stomataCountedInt: 45 },
  output: { stomatalDensityPerMm2: 180 },
} satisfies ToolExample<StomatalDensityInput, StomatalDensityOutput>;

export const stomatalDensityTool = createSimpleTool({
  id: "biology/stomatal-density",
  title: "Stomatal Density",
  description:
    "Compute stomatal density in stomata per square millimetre as the counted stomata divided by the microscopic field area.",
  inputs: [
    {
      id: "stomataCountedInt",
      kind: "integer",
      label: "Stomata counted",
      minimum: 0,
      unit: "stomata",
    },
    {
      id: "fieldAreaMm2",
      kind: "number",
      label: "Field area",
      unit: "mm²",
    },
  ],
  outputs: [
    {
      id: "stomatalDensityPerMm2",
      kind: "number",
      label: "Stomatal density",
      unit: "stomata/mm²",
    },
  ],
  calculate: (input) => {
    const stomataCountedInt = input.stomataCountedInt as number;
    const fieldAreaMm2 = input.fieldAreaMm2 as number;
    if (!(fieldAreaMm2 > 0))
      simpleError("fieldAreaMm2", "The field area must be greater than zero.");
    return { stomatalDensityPerMm2: stomataCountedInt / fieldAreaMm2 };
  },
});
export const runStomatalDensity = stomatalDensityTool.execute;
export default stomatalDensityTool;
