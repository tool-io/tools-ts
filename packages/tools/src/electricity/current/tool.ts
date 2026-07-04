import { createSimpleTool, simpleError } from "../../core/simple.js";
export const currentTool = createSimpleTool({
  id: "electricity/current",
  title: "Electrical Current Calculator",
  description:
    "Calculate electrical current from voltage and resistance using Ohm's law.",
  inputs: [
    { id: "voltage", label: "Voltage", kind: "number", unit: "V" },
    { id: "resistance", label: "Resistance", kind: "number", unit: "ohm" },
  ],
  outputs: [{ id: "current", label: "Current", kind: "number", unit: "A" }],
  calculate: (input) => {
    const resistance = input.resistance as number;
    if (resistance === 0)
      simpleError("resistance", "Resistance must not be zero.");
    return { current: (input.voltage as number) / resistance };
  },
});
export const runCurrent = currentTool.execute;
export default currentTool;
