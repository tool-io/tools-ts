import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const precipitateMassFromAnalyteExample = {
  input: { analyteMassG: 0.2, gravimetricFactor: 0.4 },
} satisfies ToolExample<{
  readonly analyteMassG: number;
  readonly gravimetricFactor: number;
}>;

export const precipitateMassFromAnalyteTool = createSimpleTool({
  id: "chemistry/precipitate-mass-from-analyte",
  title: "Precipitate Mass From Analyte",
  description:
    "Compute the precipitate mass needed for a given analyte mass using the gravimetric factor.",
  inputs: [
    {
      id: "analyteMassG",
      label: "Analyte mass",
      kind: "number",
      unit: "g",
    },
    {
      id: "gravimetricFactor",
      label: "Gravimetric factor",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "precipitateMassGrams",
      label: "Precipitate mass",
      kind: "number",
      unit: "g",
    },
  ],
  calculate: (input) => {
    const analyteMassG = input.analyteMassG as number;
    const gravimetricFactor = input.gravimetricFactor as number;
    if (!(analyteMassG > 0))
      simpleError("analyteMassG", "Analyte mass must be positive.");
    if (!(gravimetricFactor > 0))
      simpleError("gravimetricFactor", "Gravimetric factor must be positive.");
    return {
      precipitateMassGrams: analyteMassG / gravimetricFactor,
    };
  },
});
export const runPrecipitateMassFromAnalyte =
  precipitateMassFromAnalyteTool.execute;
export default precipitateMassFromAnalyteTool;
