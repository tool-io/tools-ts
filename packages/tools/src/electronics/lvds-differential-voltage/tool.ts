import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const lvdsDifferentialVoltageExample = {
  input: { differentialSwingMv: 350 },
} satisfies ToolExample<{
  readonly differentialSwingMv: number;
}>;

export const lvdsDifferentialVoltageTool = createSimpleTool({
  id: "electronics/lvds-differential-voltage",
  title: "LVDS Swing Check",
  description:
    "Check whether an LVDS differential swing in millivolts falls within the 247 mV to 454 mV specification window.",
  inputs: [
    {
      id: "differentialSwingMv",
      label: "Differential swing",
      kind: "number",
      maximum: 1000,
      minimum: 0,
      unit: "mV",
    },
  ],
  outputs: [
    {
      id: "withinSpec",
      label: "Within specification",
      kind: "boolean",
    },
  ],
  calculate: (input) => {
    const differentialSwingMv = input.differentialSwingMv as number;
    return {
      withinSpec: differentialSwingMv >= 247 && differentialSwingMv <= 454,
    };
  },
});
export const runLvdsDifferentialVoltage = lvdsDifferentialVoltageTool.execute;
export default lvdsDifferentialVoltageTool;
