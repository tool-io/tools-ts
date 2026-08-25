import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CorrectedReticulocyteCountInput = {
  readonly normalHematocritPercent?: number;
  readonly patientHematocritPercent: number;
  readonly reticulocytePercent: number;
};

export type CorrectedReticulocyteCountOutput = {
  readonly correctedReticulocytePercent: number;
};

export const correctedReticulocyteCountExample = {
  input: { patientHematocritPercent: 22.5, reticulocytePercent: 2 },
  output: { correctedReticulocytePercent: 1 },
} satisfies ToolExample<
  CorrectedReticulocyteCountInput,
  CorrectedReticulocyteCountOutput
>;

export const correctedReticulocyteCountTool = createSimpleTool({
  id: "biology/corrected-reticulocyte-count",
  title: "Corrected Retic Percent",
  description:
    "Correct the reticulocyte percent for anemia by multiplying by the patient to normal hematocrit ratio with a reference normal hematocrit of 45 percent.",
  inputs: [
    {
      id: "reticulocytePercent",
      label: "Reticulocytes",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "patientHematocritPercent",
      label: "Patient hematocrit",
      kind: "number",
      maximum: 100,
      unit: "%",
    },
    {
      default: 45,
      description: "Reference normal hematocrit.",
      id: "normalHematocritPercent",
      label: "Normal hematocrit",
      kind: "number",
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "correctedReticulocytePercent",
      label: "Corrected reticulocytes",
      kind: "number",
      unit: "%",
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
      correctedReticulocytePercent:
        ((input.reticulocytePercent as number) * patientHematocritPercent) /
        normalHematocritPercent,
    };
  },
});
export const runCorrectedReticulocyteCount =
  correctedReticulocyteCountTool.execute;
export default correctedReticulocyteCountTool;
