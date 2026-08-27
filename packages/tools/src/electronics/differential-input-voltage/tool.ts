import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DifferentialInputVoltageInput = {
  readonly vPlus: number;
  readonly vMinus: number;
};

export type DifferentialInputVoltageOutput = {
  readonly differentialVoltageV: number;
};

export const differentialInputVoltageExample = {
  input: { vPlus: 3.5, vMinus: 1.25 },
  output: { differentialVoltageV: 2.25 },
} satisfies ToolExample<
  DifferentialInputVoltageInput,
  DifferentialInputVoltageOutput
>;

export const differentialInputVoltageTool = createSimpleTool({
  id: "electronics/differential-input-voltage",
  title: "Differential Input Voltage",
  description: "Compute the signed differential input voltage as V+ minus V-.",
  inputs: [
    { id: "vPlus", label: "Non-inverting input", kind: "number", unit: "V" },
    { id: "vMinus", label: "Inverting input", kind: "number", unit: "V" },
  ],
  outputs: [
    {
      id: "differentialVoltageV",
      label: "Differential voltage",
      kind: "number",
      unit: "V",
    },
  ],
  calculate: (input) => ({
    differentialVoltageV: (input.vPlus as number) - (input.vMinus as number),
  }),
});
export const runDifferentialInputVoltage = differentialInputVoltageTool.execute;
export default differentialInputVoltageTool;
