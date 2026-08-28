import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const analyteMassFromPrecipitateExample = {
  input: { gravimetricFactor: 0.4, precipitateMassG: 0.5 },
} satisfies ToolExample<{
  readonly gravimetricFactor: number;
  readonly precipitateMassG: number;
}>;

export const analyteMassFromPrecipitateTool = createSimpleTool({
  id: "chemistry/analyte-mass-from-precipitate",
  title: "Analyte Mass From Precipitate",
  description:
    "Compute analyte mass from precipitate mass by applying the gravimetric factor.",
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
  ],
  outputs: [
    {
      id: "analyteMassGrams",
      label: "Analyte mass",
      kind: "number",
      unit: "g",
    },
  ],
  calculate: (input) => {
    const precipitateMassG = input.precipitateMassG as number;
    const gravimetricFactor = input.gravimetricFactor as number;
    if (!(precipitateMassG > 0))
      simpleError("precipitateMassG", "Precipitate mass must be positive.");
    if (!(gravimetricFactor > 0))
      simpleError("gravimetricFactor", "Gravimetric factor must be positive.");
    return {
      analyteMassGrams: precipitateMassG * gravimetricFactor,
    };
  },
});
export const runAnalyteMassFromPrecipitate =
  analyteMassFromPrecipitateTool.execute;
export default analyteMassFromPrecipitateTool;
