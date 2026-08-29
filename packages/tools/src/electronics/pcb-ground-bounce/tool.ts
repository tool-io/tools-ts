import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { sharedInductanceNh: 2, currentSlewAPerNs: 0.1 },
  output: { bounceVoltageV: 0.2 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/pcb-ground-bounce",
  title: "PCB Ground Bounce",
  description:
    "Estimate ground-bounce voltage from shared inductance and current slew rate using V=L·di/dt. Enter inductance in nH and current slew in A/ns; the numerical product is volts.",
  inputs: [
    {
      id: "sharedInductanceNh",
      kind: "number",
      label: "Shared inductance (nH)",
      minimum: 0,
    },
    { id: "currentSlewAPerNs", kind: "number", label: "Current slew (A/ns)" },
  ],
  outputs: [
    { id: "bounceVoltageV", kind: "number", label: "Bounce Voltage V" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      bounceVoltageV: i.sharedInductanceNh * i.currentSlewAPerNs,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type PcbGroundBounceInput = Readonly<typeof example.input>;
export type PcbGroundBounceOutput = Readonly<typeof example.output>;
export const pcbGroundBounceTool = tool;
export const runPcbGroundBounce = tool.execute;
export default tool;
