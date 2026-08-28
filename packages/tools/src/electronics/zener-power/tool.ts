import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const zenerPowerExample = {
  input: { zenerCurrentAmps: 0.01, zenerVolts: 5 },
} satisfies ToolExample<{
  readonly zenerCurrentAmps: number;
  readonly zenerVolts: number;
}>;

export const zenerPowerTool = createSimpleTool({
  id: "electronics/zener-power",
  title: "Zener Power Dissipation",
  description:
    "Compute the power dissipated by a Zener diode from its Zener voltage and current.",
  inputs: [
    { id: "zenerVolts", label: "Zener voltage", kind: "number" },
    { id: "zenerCurrentAmps", label: "Zener current", kind: "number" },
  ],
  outputs: [
    { id: "zenerPowerWatts", label: "Power dissipation", kind: "number" },
  ],
  calculate: (input) => {
    const zenerVolts = input.zenerVolts as number;
    const zenerCurrentAmps = input.zenerCurrentAmps as number;
    if (zenerVolts <= 0)
      simpleError("zenerVolts", "Zener voltage must be greater than zero.");
    if (zenerCurrentAmps <= 0)
      simpleError(
        "zenerCurrentAmps",
        "Zener current must be greater than zero.",
      );
    return { zenerPowerWatts: zenerVolts * zenerCurrentAmps };
  },
});
export const runZenerPower = zenerPowerTool.execute;
export default zenerPowerTool;
