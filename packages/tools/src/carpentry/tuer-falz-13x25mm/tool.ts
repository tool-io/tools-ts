import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DoorRebateInput = {
  readonly leafThicknessMm?: number;
};

export type DoorRebateOutput = {
  readonly rebateDepthMm: number;
  readonly rebateHeightMm: number;
  readonly remainingLeafThicknessMm: number;
};

export const doorRebateExample = {
  input: { leafThicknessMm: 44 },
  output: {
    rebateDepthMm: 13,
    rebateHeightMm: 25,
    remainingLeafThicknessMm: 31,
  },
} satisfies ToolExample<DoorRebateInput, DoorRebateOutput>;

export const doorRebateTool = createSimpleTool({
  id: "carpentry/tuer-falz-13x25mm",
  title: "Door Rebate Calculator",
  description:
    "Compute the standard 13 x 25 mm door rebate and the remaining leaf thickness.",
  inputs: [
    {
      default: 44,
      description: "Door leaf thickness in millimeters.",
      id: "leafThicknessMm",
      kind: "number",
      label: "Leaf thickness",
      maximum: 60,
      minimum: 35,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Standard rebate depth in millimeters.",
      id: "rebateDepthMm",
      kind: "number",
      label: "Rebate depth",
      unit: "mm",
    },
    {
      description: "Standard rebate height in millimeters.",
      id: "rebateHeightMm",
      kind: "number",
      label: "Rebate height",
      unit: "mm",
    },
    {
      description:
        "Remaining solid leaf thickness behind the rebate in millimeters.",
      id: "remainingLeafThicknessMm",
      kind: "number",
      label: "Remaining leaf thickness",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const leafThicknessMm = input.leafThicknessMm as number;
    if (leafThicknessMm - 13 < 20)
      simpleError(
        "leafThicknessMm",
        "The leaf must keep at least 20 mm of remaining thickness after the 13 mm rebate.",
        "leaf_too_thin",
      );
    return {
      rebateDepthMm: 13,
      rebateHeightMm: 25,
      remainingLeafThicknessMm: leafThicknessMm - 13,
    };
  },
});
export const runDoorRebate = doorRebateTool.execute;
export default doorRebateTool;
