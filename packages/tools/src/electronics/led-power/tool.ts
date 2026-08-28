import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ledPowerExample = {
  input: { currentAmps: 0.02, forwardVolts: 2 },
} satisfies ToolExample<{
  readonly currentAmps: number;
  readonly forwardVolts: number;
}>;

export const ledPowerTool = createSimpleTool({
  id: "electronics/led-power",
  title: "LED Power Dissipation",
  description:
    "Compute the power dissipated by an LED from its forward voltage and current.",
  inputs: [
    { id: "forwardVolts", label: "Forward voltage", kind: "number" },
    { id: "currentAmps", label: "Current", kind: "number" },
  ],
  outputs: [
    { id: "ledPowerWatts", label: "Power dissipation", kind: "number" },
  ],
  calculate: (input) => {
    const forwardVolts = input.forwardVolts as number;
    const currentAmps = input.currentAmps as number;
    if (forwardVolts <= 0)
      simpleError("forwardVolts", "Forward voltage must be greater than zero.");
    if (currentAmps <= 0)
      simpleError("currentAmps", "Current must be greater than zero.");
    return { ledPowerWatts: forwardVolts * currentAmps };
  },
});
export const runLedPower = ledPowerTool.execute;
export default ledPowerTool;
