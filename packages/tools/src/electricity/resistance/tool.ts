import { createSimpleTool, simpleError } from "../../core/simple.js";
export const resistanceTool = createSimpleTool({
  id: "electricity/resistance",
  title: "Electrical Resistance Calculator",
  description:
    "Calculate electrical resistance from voltage and current using Ohm's law.",
  inputs: [
    { id: "voltage", label: "Voltage", kind: "number", unit: "V" },
    { id: "current", label: "Current", kind: "number", unit: "A" },
  ],
  outputs: [
    { id: "resistance", label: "Resistance", kind: "number", unit: "ohm" },
  ],
  calculate: (input) => {
    const current = input.current as number;
    if (current === 0) simpleError("current", "Current must not be zero.");
    return { resistance: (input.voltage as number) / current };
  },
});
export const runResistance = resistanceTool.execute;
export default resistanceTool;
