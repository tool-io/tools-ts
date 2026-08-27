import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CommonModeVoltageInput = {
  readonly vPlus: number;
  readonly vMinus: number;
};

export type CommonModeVoltageOutput = {
  readonly commonModeVoltageV: number;
};

export const commonModeVoltageExample = {
  input: { vPlus: 3.5, vMinus: 1.25 },
  output: { commonModeVoltageV: 2.375 },
} satisfies ToolExample<CommonModeVoltageInput, CommonModeVoltageOutput>;

export const commonModeVoltageTool = createSimpleTool({
  id: "electronics/common-mode-voltage",
  title: "Common Mode Voltage",
  description:
    "Compute the common mode input voltage as the average of V+ and V-.",
  inputs: [
    { id: "vPlus", label: "Non-inverting input", kind: "number", unit: "V" },
    { id: "vMinus", label: "Inverting input", kind: "number", unit: "V" },
  ],
  outputs: [
    {
      id: "commonModeVoltageV",
      label: "Common mode voltage",
      kind: "number",
      unit: "V",
    },
  ],
  calculate: (input) => ({
    commonModeVoltageV:
      ((input.vPlus as number) + (input.vMinus as number)) / 2,
  }),
});
export const runCommonModeVoltage = commonModeVoltageTool.execute;
export default commonModeVoltageTool;
