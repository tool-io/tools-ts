import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReflectedPowerFromVswrInput = {
  readonly vswr: number;
};

export type ReflectedPowerFromVswrOutput = {
  readonly reflectedPowerPercent: number;
};

export const reflectedPowerFromVswrExample = {
  input: { vswr: 2 },
  output: { reflectedPowerPercent: 11.11111111111111 },
} satisfies ToolExample<
  ReflectedPowerFromVswrInput,
  ReflectedPowerFromVswrOutput
>;

export const reflectedPowerFromVswrTool = createSimpleTool({
  calculate: (input) => {
    const vswr = input.vswr as number;
    if (!(vswr >= 1))
      simpleError("vswr", "VSWR must be at least one.", "invalid_vswr");
    return {
      reflectedPowerPercent: ((vswr - 1) / (vswr + 1)) ** 2 * 100,
    };
  },
  description:
    "Compute the percentage of power reflected by a load from its VSWR as ((VSWR - 1)/(VSWR + 1))^2 x 100.",
  id: "electronics/reflected-power-from-vswr",
  inputs: [{ id: "vswr", kind: "number", label: "VSWR" }],
  outputs: [
    {
      id: "reflectedPowerPercent",
      kind: "number",
      label: "Reflected power",
      unit: "%",
    },
  ],
  title: "Reflected Power %",
});
export const runReflectedPowerFromVswr = reflectedPowerFromVswrTool.execute;
export default reflectedPowerFromVswrTool;
