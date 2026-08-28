import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const percentAnalyteGravimetryExample = {
  input: {
    gravimetricFactor: 0.4,
    precipitateMassG: 0.5,
    sampleMassG: 2,
  },
} satisfies ToolExample<{
  readonly gravimetricFactor: number;
  readonly precipitateMassG: number;
  readonly sampleMassG: number;
}>;

export const percentAnalyteGravimetryTool = createSimpleTool({
  id: "chemistry/percent-analyte-gravimetry",
  title: "Percent Analyte Gravimetry",
  description:
    "Compute the mass percent of analyte in a sample from precipitate mass and gravimetric factor.",
  inputs: [
    {
      id: "precipitateMassG",
      label: "Precipitate mass",
      kind: "number",
      unit: "g",
    },
    {
      id: "gravimetricFactor",
      label: "Gravimetric factor",
      kind: "number",
    },
    { id: "sampleMassG", label: "Sample mass", kind: "number", unit: "g" },
  ],
  outputs: [
    {
      id: "percentAnalyte",
      label: "Percent analyte",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const precipitateMassG = input.precipitateMassG as number;
    const gravimetricFactor = input.gravimetricFactor as number;
    const sampleMassG = input.sampleMassG as number;
    if (!(precipitateMassG > 0))
      simpleError("precipitateMassG", "Precipitate mass must be positive.");
    if (!(gravimetricFactor > 0))
      simpleError("gravimetricFactor", "Gravimetric factor must be positive.");
    if (!(sampleMassG > 0))
      simpleError("sampleMassG", "Sample mass must be positive.");
    return {
      percentAnalyte:
        ((precipitateMassG * gravimetricFactor) / sampleMassG) * 100,
    };
  },
});
export const runPercentAnalyteGravimetry = percentAnalyteGravimetryTool.execute;
export default percentAnalyteGravimetryTool;
