import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const reactivePowerExample = {
  input: { ampsRms: 1, phaseDegrees: 90, voltsRms: 120 },
} satisfies ToolExample<{
  readonly ampsRms: number;
  readonly phaseDegrees: number;
  readonly voltsRms: number;
}>;

export const reactivePowerTool = createSimpleTool({
  id: "electronics/reactive-power",
  title: "Reactive Power VAR",
  description:
    "Calculate signed reactive power in volt-amperes reactive from RMS voltage, RMS current, and phase angle.",
  inputs: [
    { id: "voltsRms", label: "RMS voltage", kind: "number", unit: "V" },
    { id: "ampsRms", label: "RMS current", kind: "number", unit: "A" },
    {
      id: "phaseDegrees",
      label: "Phase angle",
      kind: "number",
      unit: "deg",
    },
  ],
  outputs: [
    {
      id: "reactivePowerVar",
      label: "Reactive power",
      kind: "number",
      unit: "var",
    },
  ],
  calculate: (input) => ({
    reactivePowerVar:
      (input.voltsRms as number) *
      (input.ampsRms as number) *
      Math.sin(((input.phaseDegrees as number) * Math.PI) / 180),
  }),
});
export const runReactivePower = reactivePowerTool.execute;
export default reactivePowerTool;
