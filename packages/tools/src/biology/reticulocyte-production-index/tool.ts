import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReticulocyteProductionIndexInput = {
  readonly maturationFactor?: number;
  readonly normalHematocritPercent?: number;
  readonly patientHematocritPercent: number;
  readonly reticulocytePercent: number;
};

export type ReticulocyteProductionIndexOutput = {
  readonly reticulocyteProductionIndex: number;
};

export const reticulocyteProductionIndexExample = {
  input: { patientHematocritPercent: 22.5, reticulocytePercent: 2 },
  output: { reticulocyteProductionIndex: 0.6666666666666666 },
} satisfies ToolExample<
  ReticulocyteProductionIndexInput,
  ReticulocyteProductionIndexOutput
>;

export const reticulocyteProductionIndexTool = createSimpleTool({
  id: "biology/reticulocyte-production-index",
  title: "RPI Corrected",
  description:
    "Compute the corrected reticulocyte production index as the reticulocyte percent divided by a maturation factor and scaled by the patient to normal hematocrit ratio.",
  inputs: [
    {
      id: "reticulocytePercent",
      label: "Reticulocytes",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      default: 1.5,
      description: "Maturation factor for marrow correction.",
      id: "maturationFactor",
      label: "Maturation factor",
      kind: "number",
      maximum: 4,
      minimum: 1,
    },
    {
      id: "patientHematocritPercent",
      label: "Patient hematocrit",
      kind: "number",
      unit: "%",
    },
    {
      default: 45,
      description: "Reference normal hematocrit.",
      id: "normalHematocritPercent",
      label: "Normal hematocrit",
      kind: "number",
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "reticulocyteProductionIndex",
      label: "Reticulocyte production index",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const patientHematocritPercent = input.patientHematocritPercent as number;
    const normalHematocritPercent = input.normalHematocritPercent as number;
    if (patientHematocritPercent <= 0)
      simpleError(
        "patientHematocritPercent",
        "The patient hematocrit must be greater than zero.",
      );
    if (normalHematocritPercent <= 0)
      simpleError(
        "normalHematocritPercent",
        "The normal hematocrit must be greater than zero.",
      );
    return {
      reticulocyteProductionIndex:
        ((input.reticulocytePercent as number) /
          (input.maturationFactor as number)) *
        (patientHematocritPercent / normalHematocritPercent),
    };
  },
});
export const runReticulocyteProductionIndex =
  reticulocyteProductionIndexTool.execute;
export default reticulocyteProductionIndexTool;
