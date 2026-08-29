import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { deviceCapacitancePf: 80, wiringCapacitancePf: 40 },
  output: { totalCapacitancePf: 120 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/i2c-bus-capacitance",
  title: "I²C Bus Capacitance",
  description:
    "Sum device input capacitance and wiring capacitance to estimate total I²C bus capacitance. Use datasheet values and include all connected devices; whether the result meets a limit depends on the I²C mode.",
  inputs: [
    {
      id: "deviceCapacitancePf",
      kind: "number",
      label: "Total device capacitance (pF)",
      minimum: 0,
    },
    {
      id: "wiringCapacitancePf",
      kind: "number",
      label: "Wiring capacitance (pF)",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "totalCapacitancePf", kind: "number", label: "Total Capacitance pF" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      totalCapacitancePf: i.deviceCapacitancePf + i.wiringCapacitancePf,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type I2cBusCapacitanceInput = Readonly<typeof example.input>;
export type I2cBusCapacitanceOutput = Readonly<typeof example.output>;
export const i2cBusCapacitanceTool = tool;
export const runI2cBusCapacitance = tool.execute;
export default tool;
