import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VoltageRegulatorPowerDissipationInput = {
  readonly inputVolts: number;
  readonly loadCurrentA: number;
  readonly outputVolts: number;
};

export type VoltageRegulatorPowerDissipationOutput = {
  readonly powerDissipationWatts: number;
};

export const voltageRegulatorPowerDissipationExample = {
  input: { inputVolts: 12, loadCurrentA: 1, outputVolts: 5 },
  output: { powerDissipationWatts: 7 },
} satisfies ToolExample<
  VoltageRegulatorPowerDissipationInput,
  VoltageRegulatorPowerDissipationOutput
>;

export const calculateVoltageRegulatorPowerDissipation = (
  input: VoltageRegulatorPowerDissipationInput,
): VoltageRegulatorPowerDissipationOutput => {
  if (input.inputVolts < input.outputVolts)
    simpleError(
      "inputVolts",
      "Input voltage must not be below output voltage.",
      "negative_differential",
    );
  return {
    powerDissipationWatts:
      (input.inputVolts - input.outputVolts) * input.loadCurrentA,
  };
};

export const voltageRegulatorPowerDissipationTool = createSimpleTool({
  calculate: (input) =>
    calculateVoltageRegulatorPowerDissipation(
      input as unknown as VoltageRegulatorPowerDissipationInput,
    ),
  description: "Calculate linear regulator power dissipation.",
  id: "electronics/voltage-regulator-power-dissipation",
  inputs: [
    { id: "inputVolts", kind: "number", label: "Input voltage", unit: "V" },
    { id: "outputVolts", kind: "number", label: "Output voltage", unit: "V" },
    { id: "loadCurrentA", kind: "number", label: "Load current", unit: "A" },
  ],
  outputs: [
    {
      id: "powerDissipationWatts",
      kind: "number",
      label: "Power dissipation",
      unit: "W",
    },
  ],
  title: "Regulator Dissipation",
});
export const runVoltageRegulatorPowerDissipation =
  voltageRegulatorPowerDissipationTool.execute;
export default voltageRegulatorPowerDissipationTool;
