import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const strokeVolumeExample = {
  input: { endDiastolicMl: 120, endSystolicMl: 50 },
  output: { strokeVolumeMl: 70 },
} satisfies ToolExample<
  { readonly endDiastolicMl: number; readonly endSystolicMl: number },
  { readonly strokeVolumeMl: number }
>;

export const strokeVolumeTool = createSimpleTool({
  id: "biology/stroke-volume",
  title: "Stroke Volume mL",
  description:
    "Compute stroke volume as end-diastolic volume minus end-systolic volume.",
  inputs: [
    {
      id: "endDiastolicMl",
      kind: "number",
      label: "End-diastolic volume",
      minimum: Number.MIN_VALUE,
      unit: "mL",
    },
    {
      id: "endSystolicMl",
      kind: "number",
      label: "End-systolic volume",
      minimum: Number.MIN_VALUE,
      unit: "mL",
    },
  ],
  outputs: [
    {
      id: "strokeVolumeMl",
      kind: "number",
      label: "Stroke volume",
      unit: "mL",
    },
  ],
  calculate: (input) => {
    const endDiastolicMl = input.endDiastolicMl as number;
    const endSystolicMl = input.endSystolicMl as number;
    if (endSystolicMl > endDiastolicMl)
      simpleError(
        "endSystolicMl",
        "End-systolic volume must not exceed end-diastolic volume.",
        "negative_volume",
      );
    return { strokeVolumeMl: endDiastolicMl - endSystolicMl };
  },
});
export const runStrokeVolume = strokeVolumeTool.execute;
export default strokeVolumeTool;
