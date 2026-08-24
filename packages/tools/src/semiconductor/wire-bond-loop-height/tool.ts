import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WireBondLoopHeightInput = {
  readonly loopAngleDegrees: number;
  readonly spanUm: number;
};

export type WireBondLoopHeightOutput = {
  readonly loopHeightUm: number;
};

export const wireBondLoopHeightExample = {
  input: { loopAngleDegrees: 30, spanUm: 2000 },
  output: { loopHeightUm: 577.3502691896257 },
} satisfies ToolExample<WireBondLoopHeightInput, WireBondLoopHeightOutput>;

export const wireBondLoopHeightTool = createSimpleTool({
  calculate: (input) => {
    const spanUm = input.spanUm as number;
    if (!(spanUm > 0))
      simpleError("spanUm", "Wire span must be positive.", "invalid_span");
    const angle = input.loopAngleDegrees as number;
    if (!(angle > 0 && angle < 90))
      simpleError(
        "loopAngleDegrees",
        "Loop angle must be between 0 and 90 degrees exclusive.",
        "invalid_loop_angle",
      );
    return {
      loopHeightUm: (spanUm * Math.tan((angle * Math.PI) / 180)) / 2,
    };
  },
  description:
    "Estimate the apex height of a symmetric wire bond loop from its bond-to-bond span and loop angle.",
  id: "semiconductor/wire-bond-loop-height",
  inputs: [
    {
      description: "Wire rise angle relative to the die surface.",
      id: "loopAngleDegrees",
      kind: "number",
      label: "Loop angle",
      unit: "deg",
    },
    {
      description: "Distance between the two bond points.",
      id: "spanUm",
      kind: "number",
      label: "Wire span",
      unit: "µm",
    },
  ],
  outputs: [
    {
      description: "Loop apex height above the bond plane.",
      id: "loopHeightUm",
      kind: "number",
      label: "Loop height",
      unit: "µm",
    },
  ],
  title: "Wire Loop Height Calculator",
});
export const runWireBondLoopHeight = wireBondLoopHeightTool.execute;
export default wireBondLoopHeightTool;
