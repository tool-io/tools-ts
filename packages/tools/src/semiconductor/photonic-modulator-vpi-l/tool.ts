import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ModulatorVpiLInput = {
  readonly interactionLengthMm: number;
  readonly piSwitchVoltageVolts: number;
};

export type ModulatorVpiLOutput = {
  readonly voltageLengthProductVMm: number;
};

export const modulatorVpiLExample = {
  input: { interactionLengthMm: 10, piSwitchVoltageVolts: 2 },
  output: { voltageLengthProductVMm: 20 },
} satisfies ToolExample<ModulatorVpiLInput, ModulatorVpiLOutput>;

export const modulatorVpiLTool = createSimpleTool({
  calculate: (input) => {
    const length = input.interactionLengthMm as number;
    const voltage = input.piSwitchVoltageVolts as number;
    if (!(voltage > 0))
      simpleError(
        "piSwitchVoltageVolts",
        "Switching voltage must be positive.",
        "invalid_voltage",
      );
    if (!(length > 0))
      simpleError(
        "interactionLengthMm",
        "Interaction length must be positive.",
        "invalid_length",
      );
    return { voltageLengthProductVMm: voltage * length };
  },
  description:
    "Compute the electro-optic voltage-length product of a modulator from its pi switching voltage and interaction length.",
  id: "semiconductor/photonic-modulator-vpi-l",
  inputs: [
    {
      id: "interactionLengthMm",
      kind: "number",
      label: "Interaction length",
      minimum: Number.MIN_VALUE,
      unit: "mm",
    },
    {
      id: "piSwitchVoltageVolts",
      kind: "number",
      label: "Pi switching voltage",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "voltageLengthProductVMm",
      kind: "number",
      label: "V·pi L product",
      minimum: Number.MIN_VALUE,
      unit: "V·mm",
    },
  ],
  title: "Modulator V·pi L Calculator",
});
export const runModulatorVpiL = modulatorVpiLTool.execute;
export default modulatorVpiLTool;
