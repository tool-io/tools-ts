import { createSimpleTool } from "../../core/simple.js";
export const voltageTool = createSimpleTool({
  id: "electricity/voltage",
  title: "Electrical Voltage Calculator",
  description:
    "Calculate electrical voltage from current and resistance using Ohm's law.",
  inputs: [
    { id: "current", label: "Current", kind: "number", unit: "A" },
    { id: "resistance", label: "Resistance", kind: "number", unit: "ohm" },
  ],
  outputs: [{ id: "voltage", label: "Voltage", kind: "number", unit: "V" }],
  calculate: (input) => {
    return {
      voltage: (input.current as number) * (input.resistance as number),
    };
  },
});
export const runVoltage = voltageTool.execute;
export default voltageTool;
