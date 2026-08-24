import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MemristorSwitchingVoltageInput = {
  readonly oxideThicknessNm: number;
  readonly thresholdFieldMVPerCm: number;
};

export type MemristorSwitchingVoltageOutput = {
  readonly switchingVolts: number;
};

export const memristorSwitchingVoltageExample = {
  input: { oxideThicknessNm: 10, thresholdFieldMVPerCm: 1 },
  output: { switchingVolts: 1 },
} satisfies ToolExample<
  MemristorSwitchingVoltageInput,
  MemristorSwitchingVoltageOutput
>;

export const memristorSwitchingVoltageTool = createSimpleTool({
  id: "semiconductor/memristor-switching-voltage",
  title: "Memristor Switching Voltage Calculator",
  description:
    "Compute the memristor threshold switching voltage from the switching field in MV/cm and oxide thickness in nanometres.",
  inputs: [
    {
      description: "Field required to switch the resistive state.",
      id: "thresholdFieldMVPerCm",
      kind: "number",
      label: "Threshold field",
      minimum: Number.MIN_VALUE,
      unit: "MV/cm",
    },
    {
      description: "Switching oxide thickness.",
      id: "oxideThicknessNm",
      kind: "number",
      label: "Oxide thickness",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Applied voltage that reaches the switching field.",
      id: "switchingVolts",
      kind: "number",
      label: "Switching voltage",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
  ],
  calculate: (input) => {
    const thresholdFieldMVPerCm = input.thresholdFieldMVPerCm as number;
    const oxideThicknessNm = input.oxideThicknessNm as number;
    if (!(thresholdFieldMVPerCm > 0))
      simpleError(
        "thresholdFieldMVPerCm",
        "Threshold field must be greater than zero.",
      );
    if (!(oxideThicknessNm > 0))
      simpleError(
        "oxideThicknessNm",
        "Oxide thickness must be greater than zero.",
      );
    return {
      switchingVolts: thresholdFieldMVPerCm * oxideThicknessNm * 0.1,
    };
  },
});
export const runMemristorSwitchingVoltage =
  memristorSwitchingVoltageTool.execute;
export default memristorSwitchingVoltageTool;
