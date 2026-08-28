import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const transistorBaseResistorExample = {
  input: { baseCurrentMa: 0.1, controlVolts: 5 },
} satisfies ToolExample<{
  readonly baseCurrentMa: number;
  readonly controlVolts: number;
}>;

export const transistorBaseResistorTool = createSimpleTool({
  id: "electronics/transistor-base-resistor",
  title: "Base Resistor Value",
  description:
    "Compute the base resistor value in ohms for a bipolar junction transistor from the control voltage, base-emitter voltage, and base current.",
  inputs: [
    { id: "controlVolts", label: "Control voltage", kind: "number" },
    {
      default: 0.7,
      id: "baseEmitterVolts",
      label: "Base-emitter voltage",
      kind: "number",
    },
    { id: "baseCurrentMa", label: "Base current", kind: "number" },
  ],
  outputs: [{ id: "baseResistorOhms", label: "Base resistor", kind: "number" }],
  calculate: (input) => {
    const controlVolts = input.controlVolts as number;
    const baseEmitterVolts = input.baseEmitterVolts as number;
    const baseCurrentMa = input.baseCurrentMa as number;
    if (controlVolts <= baseEmitterVolts)
      simpleError(
        "controlVolts",
        "Control voltage must exceed the base-emitter voltage.",
        "insufficient_drive",
      );
    if (baseCurrentMa <= 0)
      simpleError("baseCurrentMa", "Base current must be greater than zero.");
    return {
      baseResistorOhms:
        ((controlVolts - baseEmitterVolts) / baseCurrentMa) * 1000,
    };
  },
});
export const runTransistorBaseResistor = transistorBaseResistorTool.execute;
export default transistorBaseResistorTool;
