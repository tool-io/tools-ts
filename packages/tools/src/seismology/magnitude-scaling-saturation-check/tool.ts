import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const magnitudeScalingSaturationCheckExample = {
  input: { faultLengthKm: 400 },
  output: { linearEstimateMw: 8.257069387078664, saturated: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const magnitudeScalingSaturationCheckTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ faultLengthKm, saturationMagnitude }) => {
      if (!(faultLengthKm > 0))
        simpleError("faultLengthKm", "Fault length must be positive.");
      const m = 4.38 + 1.49 * Math.log10(faultLengthKm);
      return {
        linearEstimateMw: m,
        saturated: m > (saturationMagnitude ?? 7.8),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Flag whether a rupture length implies magnitude beyond the empirical saturation limit (~M7.8) of simple linear scaling.",
  id: "seismology/magnitude-scaling-saturation-check",
  inputs: [
    {
      minimum: 0,
      description: "Rupture length.",
      id: "faultLengthKm",
      kind: "number",
      label: "L",
      unit: "km",
    },
    {
      default: 7.8,
      description: "Saturation magnitude cap.",
      id: "saturationMagnitude",
      kind: "number",
      label: "M_sat",
    },
  ],
  outputs: [
    {
      description: "Uncapped linear-scaling magnitude.",
      id: "linearEstimateMw",
      kind: "number",
      label: "M_linear",
    },
    {
      description: "Whether the estimate exceeds the cap.",
      id: "saturated",
      kind: "boolean",
      label: "Saturated",
    },
  ],
  title: "Magnitude Scaling Saturation Check Tool",
});
export const runMagnitudeScalingSaturationCheck =
  magnitudeScalingSaturationCheckTool.execute;
export { magnitudeScalingSaturationCheckExample as example };
export default magnitudeScalingSaturationCheckTool;
