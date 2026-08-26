import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HemoglobinA1cEstimatedAverageGlucoseInput = {
  readonly hba1cPercent: number;
};

export type HemoglobinA1cEstimatedAverageGlucoseOutput = {
  readonly estimatedAverageGlucoseMgDl: number;
};

export const hemoglobinA1cEstimatedAverageGlucoseExample = {
  input: { hba1cPercent: 6 },
  output: { estimatedAverageGlucoseMgDl: 125.49999999999999 },
} satisfies ToolExample<
  HemoglobinA1cEstimatedAverageGlucoseInput,
  HemoglobinA1cEstimatedAverageGlucoseOutput
>;

export const hemoglobinA1cEstimatedAverageGlucoseTool = createSimpleTool({
  id: "biology/hemoglobin-a1c-estimated-average-glucose",
  title: "eAG From A1c",
  description:
    "Estimate average glucose in mg/dL from hemoglobin A1c with the documented ADAG regression 28.7 x A1c - 46.7.",
  inputs: [
    {
      id: "hba1cPercent",
      label: "HbA1c",
      kind: "number",
      maximum: 20,
      minimum: 3,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "estimatedAverageGlucoseMgDl",
      label: "Estimated average glucose",
      kind: "number",
      unit: "mg/dL",
    },
  ],
  calculate: (input) => ({
    estimatedAverageGlucoseMgDl: 28.7 * (input.hba1cPercent as number) - 46.7,
  }),
});
export const runHemoglobinA1cEstimatedAverageGlucose =
  hemoglobinA1cEstimatedAverageGlucoseTool.execute;
export default hemoglobinA1cEstimatedAverageGlucoseTool;
