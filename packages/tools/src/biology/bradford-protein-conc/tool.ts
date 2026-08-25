import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bradfordProteinConcExample = {
  input: { absorbance595: 0.4, calibrationSlope: 0.02 },
} satisfies ToolExample<{
  readonly absorbance595: number;
  readonly calibrationSlope: number;
}>;

export const bradfordProteinConcTool = createSimpleTool({
  id: "biology/bradford-protein-conc",
  title: "Bradford Protein Conc",
  description:
    "Convert a Bradford assay A595 reading into protein concentration using the slope of the standard curve.",
  inputs: [
    {
      id: "absorbance595",
      label: "Absorbance A595",
      kind: "number",
      minimum: 0,
    },
    { id: "calibrationSlope", label: "Calibration slope", kind: "number" },
  ],
  outputs: [
    {
      id: "proteinUgPerMl",
      label: "Protein concentration",
      kind: "number",
      unit: "µg/mL",
    },
  ],
  calculate: (input) => {
    const calibrationSlope = input.calibrationSlope as number;
    if (calibrationSlope <= 0)
      simpleError(
        "calibrationSlope",
        "Calibration slope must be greater than zero.",
        "invalid_value",
      );
    return {
      proteinUgPerMl: (input.absorbance595 as number) / calibrationSlope,
    };
  },
});
export const runBradfordProteinConc = bradfordProteinConcTool.execute;
export default bradfordProteinConcTool;
