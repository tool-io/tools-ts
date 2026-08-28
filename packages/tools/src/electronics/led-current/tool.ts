import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ledCurrentExample = {
  input: { forwardVolts: 2, resistorOhms: 150, supplyVolts: 5 },
} satisfies ToolExample<{
  readonly forwardVolts: number;
  readonly resistorOhms: number;
  readonly supplyVolts: number;
}>;

export const ledCurrentTool = createSimpleTool({
  id: "electronics/led-current",
  title: "LED Current Resistor",
  description:
    "Compute the current through an LED in milliamps given the supply voltage, forward voltage, and series resistor.",
  inputs: [
    { id: "supplyVolts", label: "Supply voltage", kind: "number" },
    { id: "forwardVolts", label: "Forward voltage", kind: "number" },
    { id: "resistorOhms", label: "Series resistor", kind: "number" },
  ],
  outputs: [{ id: "ledCurrentMa", label: "LED current", kind: "number" }],
  calculate: (input) => {
    const supplyVolts = input.supplyVolts as number;
    const forwardVolts = input.forwardVolts as number;
    const resistorOhms = input.resistorOhms as number;
    if (supplyVolts <= forwardVolts)
      simpleError(
        "supplyVolts",
        "Supply voltage must exceed the forward voltage.",
        "reverse_bias",
      );
    if (resistorOhms <= 0)
      simpleError("resistorOhms", "Resistor must be greater than zero.");
    return {
      ledCurrentMa: ((supplyVolts - forwardVolts) / resistorOhms) * 1000,
    };
  },
});
export const runLedCurrent = ledCurrentTool.execute;
export default ledCurrentTool;
