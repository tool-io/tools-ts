import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type TackingAngleInput = {
  readonly closeHauledAngleDeg: number;
};

export type TackingAngleOutput = {
  readonly tackingAngle: number;
};

export const tackingAngleExample = {
  input: { closeHauledAngleDeg: 45 },
  output: { tackingAngle: 90 },
} satisfies ToolExample<TackingAngleInput, TackingAngleOutput>;

export const tackingAngleTool = createSimpleTool({
  calculate: (input) => ({
    tackingAngle: 2 * (input.closeHauledAngleDeg as number),
  }),
  description:
    "Calculate the tacking angle using tackingAngle = 2 * closeHauledAngleDeg from the close-hauled angle off the wind.",
  id: "sailing/tacking-angle",
  inputs: [
    {
      description:
        "Close-hauled angle off the wind, between 10 and 80 degrees.",
      id: "closeHauledAngleDeg",
      kind: "number",
      label: "Close-hauled angle",
      maximum: 80,
      minimum: 10,
      unit: "deg",
    },
  ],
  outputs: [
    {
      description: "Total angle between the two tacks.",
      id: "tackingAngle",
      kind: "number",
      label: "Tacking angle",
      unit: "deg",
    },
  ],
  title: "Tacking Angle Calculator",
});
export const runTackingAngle = tackingAngleTool.execute;
export default tackingAngleTool;
