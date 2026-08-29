import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { carrierDensityPerM3: 1e22, plateThicknessM: 0.001 },
  output: { sensitivityVPerAT: 0.6241509074460763 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/hall-sensitivity",
  title: "Hall Voltage Sensitivity",
  description:
    "Estimate single-carrier Hall voltage sensitivity V_H/(IB)=1/(nqt) from carrier density and plate thickness. Assumes a simple Hall plate with one carrier type and Hall factor 1.",
  inputs: [
    {
      id: "carrierDensityPerM3",
      kind: "number",
      label: "Carrier density (1/m³)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "plateThicknessM",
      kind: "number",
      label: "Plate thickness (m)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "sensitivityVPerAT", kind: "number", label: "Sensitivity VPer AT" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      sensitivityVPerAT:
        1 / (i.carrierDensityPerM3 * 1.602176634e-19 * i.plateThicknessM),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type HallSensitivityInput = Readonly<typeof example.input>;
export type HallSensitivityOutput = Readonly<typeof example.output>;
export const hallSensitivityTool = tool;
export const runHallSensitivity = tool.execute;
export default tool;
