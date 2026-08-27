import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const proteinConcentrationOd280Example = {
  input: { absorbance280: 0.5, extinctionCoefficientMgMlCm: 2 },
} satisfies ToolExample<{
  readonly absorbance280: number;
  readonly extinctionCoefficientMgMlCm: number;
}>;

export const proteinConcentrationOd280Tool = createSimpleTool({
  id: "biology/protein-concentration-od280",
  title: "Protein Conc From A280",
  description:
    "Convert an A280 absorbance reading into protein concentration via the Beer-Lambert mass extinction coefficient in mL/(mg·cm).",
  inputs: [
    {
      id: "absorbance280",
      label: "Absorbance A280",
      kind: "number",
      minimum: 0,
    },
    {
      default: 1,
      id: "dilutionFactor",
      label: "Dilution factor",
      kind: "number",
      minimum: 1,
    },
    {
      default: 1,
      id: "extinctionCoefficientMgMlCm",
      label: "Extinction coefficient",
      kind: "number",
      unit: "mL/(mg·cm)",
    },
    {
      default: 1,
      id: "pathLengthCm",
      label: "Optical path length",
      kind: "number",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
  ],
  outputs: [
    {
      id: "proteinConcentrationMgMl",
      label: "Protein concentration",
      kind: "number",
      unit: "mg/mL",
    },
  ],
  calculate: (input) => {
    const extinctionCoefficientMgMlCm =
      input.extinctionCoefficientMgMlCm as number;
    if (extinctionCoefficientMgMlCm <= 0)
      simpleError(
        "extinctionCoefficientMgMlCm",
        "Extinction coefficient must be greater than zero.",
        "invalid_value",
      );
    return {
      proteinConcentrationMgMl:
        ((input.absorbance280 as number) * (input.dilutionFactor as number)) /
        (extinctionCoefficientMgMlCm * (input.pathLengthCm as number)),
    };
  },
});
export const runProteinConcentrationOd280 =
  proteinConcentrationOd280Tool.execute;
export default proteinConcentrationOd280Tool;
