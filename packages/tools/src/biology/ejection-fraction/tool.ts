import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ejectionFractionExample = {
  input: { endDiastolicMl: 120, strokeVolumeMl: 70 },
  output: { ejectionFractionPercent: 58.333333333333336 },
} satisfies ToolExample<
  { readonly endDiastolicMl: number; readonly strokeVolumeMl: number },
  { readonly ejectionFractionPercent: number }
>;

export const ejectionFractionTool = createSimpleTool({
  id: "biology/ejection-fraction",
  title: "Ejection Fraction %",
  description:
    "Compute ejection fraction as a percentage of end-diastolic volume.",
  inputs: [
    {
      id: "strokeVolumeMl",
      kind: "number",
      label: "Stroke volume",
      minimum: 0,
      unit: "mL",
    },
    {
      id: "endDiastolicMl",
      kind: "number",
      label: "End-diastolic volume",
      minimum: Number.MIN_VALUE,
      unit: "mL",
    },
  ],
  outputs: [
    {
      id: "ejectionFractionPercent",
      kind: "number",
      label: "Ejection fraction",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const strokeVolumeMl = input.strokeVolumeMl as number;
    const endDiastolicMl = input.endDiastolicMl as number;
    if (strokeVolumeMl > endDiastolicMl)
      simpleError(
        "strokeVolumeMl",
        "Stroke volume must not exceed end-diastolic volume.",
        "invalid_volumes",
      );
    return {
      ejectionFractionPercent: (strokeVolumeMl / endDiastolicMl) * 100,
    };
  },
});
export const runEjectionFraction = ejectionFractionTool.execute;
export default ejectionFractionTool;
