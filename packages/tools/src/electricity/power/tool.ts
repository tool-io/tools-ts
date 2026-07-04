import { createSimpleTool } from "../../core/simple.js";
export const powerTool = createSimpleTool({
  id: "electricity/power",
  title: "Electrical Power Calculator",
  description: "Calculate electrical power from voltage and current.",
  inputs: [
    { id: "voltage", label: "Voltage", kind: "number", unit: "V" },
    { id: "current", label: "Current", kind: "number", unit: "A" },
  ],
  outputs: [{ id: "power", label: "Power", kind: "number", unit: "W" }],
  calculate: (input) => {
    return { power: (input.voltage as number) * (input.current as number) };
  },
});
export const runPower = powerTool.execute;
export default powerTool;
