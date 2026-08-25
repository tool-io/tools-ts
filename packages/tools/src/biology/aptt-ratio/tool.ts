import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const apttRatioExample = {
  input: { controlApttSeconds: 35, patientApttSeconds: 90 },
  output: { apttRatio: 2.5714285714285716 },
} satisfies ToolExample<
  { readonly controlApttSeconds: number; readonly patientApttSeconds: number },
  { readonly apttRatio: number }
>;

export const apttRatioTool = createSimpleTool({
  id: "biology/aptt-ratio",
  title: "APTT Ratio",
  description:
    "Compute the activated partial thromboplastin time ratio as the patient APTT divided by the control APTT.",
  inputs: [
    {
      id: "patientApttSeconds",
      label: "Patient APTT",
      kind: "number",
      unit: "s",
    },
    {
      id: "controlApttSeconds",
      label: "Control APTT",
      kind: "number",
      unit: "s",
    },
  ],
  outputs: [{ id: "apttRatio", label: "APTT ratio", kind: "number" }],
  calculate: (input) => {
    const patientApttSeconds = input.patientApttSeconds as number;
    const controlApttSeconds = input.controlApttSeconds as number;
    if (patientApttSeconds <= 0)
      simpleError(
        "patientApttSeconds",
        "Patient APTT must be greater than zero.",
      );
    if (controlApttSeconds <= 0)
      simpleError(
        "controlApttSeconds",
        "Control APTT must be greater than zero.",
      );
    return { apttRatio: patientApttSeconds / controlApttSeconds };
  },
});
export const runApttRatio = apttRatioTool.execute;
export default apttRatioTool;
