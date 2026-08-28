import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LogicThresholdCmosInput = {
  readonly vddVolts: number;
};

export type LogicThresholdCmosOutput = {
  readonly vihMinV: number;
  readonly vilMaxV: number;
};

export const logicThresholdCmosExample = {
  input: { vddVolts: 5 },
  output: { vihMinV: 3.5, vilMaxV: 1.5 },
} satisfies ToolExample<LogicThresholdCmosInput, LogicThresholdCmosOutput>;

export const calculateLogicThresholdCmos = (
  input: LogicThresholdCmosInput,
): LogicThresholdCmosOutput => {
  if (!(input.vddVolts > 0))
    simpleError("vddVolts", "Supply voltage must be positive.", "invalid_vdd");
  return {
    vihMinV: 0.7 * input.vddVolts,
    vilMaxV: 0.3 * input.vddVolts,
  };
};

export const logicThresholdCmosTool = createSimpleTool({
  calculate: (input) =>
    calculateLogicThresholdCmos(input as unknown as LogicThresholdCmosInput),
  description:
    "Compute CMOS logic level thresholds at a supply voltage: VIH min = 0.7 x Vdd and VIL max = 0.3 x Vdd.",
  id: "electronics/logic-threshold-cmos",
  inputs: [
    { id: "vddVolts", kind: "number", label: "Supply voltage", unit: "V" },
  ],
  outputs: [
    { id: "vihMinV", kind: "number", label: "VIH minimum", unit: "V" },
    { id: "vilMaxV", kind: "number", label: "VIL maximum", unit: "V" },
  ],
  title: "CMOS Thresholds",
});
export const runLogicThresholdCmos = logicThresholdCmosTool.execute;
export default logicThresholdCmosTool;
