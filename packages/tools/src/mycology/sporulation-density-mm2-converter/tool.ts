import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SporulationDensityMm2ConverterInput = {
  readonly countedSpores: number;
  readonly fieldAreaMm2: number;
};

export type SporulationDensityMm2ConverterOutput = {
  readonly sporesPerMm2: number;
};

export const sporulationDensityMm2ConverterExample = {
  input: { countedSpores: 200, fieldAreaMm2: 4 },
  output: { sporesPerMm2: 50 },
} satisfies ToolExample<
  SporulationDensityMm2ConverterInput,
  SporulationDensityMm2ConverterOutput
>;

export const sporulationDensityMm2ConverterTool = createSimpleTool({
  id: "mycology/sporulation-density-mm2-converter",
  title: "Sporulation Density",
  description:
    "Convert a counted spore number and field area into spores per square millimeter.",
  inputs: [
    {
      id: "countedSpores",
      kind: "integer",
      label: "Counted spores",
      minimum: 0,
    },
    {
      id: "fieldAreaMm2",
      kind: "number",
      label: "Field area",
      minimum: Number.MIN_VALUE,
      unit: "mm²",
    },
  ],
  outputs: [
    {
      id: "sporesPerMm2",
      label: "Spores per mm²",
      kind: "number",
      minimum: 0,
      unit: "spores/mm²",
    },
  ],
  calculate: (input) => {
    const fieldAreaMm2 = input.fieldAreaMm2 as number;
    if (!(fieldAreaMm2 > 0))
      simpleError("fieldAreaMm2", "Field area must be positive.");
    return {
      sporesPerMm2: (input.countedSpores as number) / fieldAreaMm2,
    };
  },
});
export const runSporulationDensityMm2Converter =
  sporulationDensityMm2ConverterTool.execute;
export default sporulationDensityMm2ConverterTool;
