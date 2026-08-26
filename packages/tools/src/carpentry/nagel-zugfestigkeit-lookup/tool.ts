import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NailWoodGroup = "hardwood" | "softwood";

export type NailWithdrawalInput = {
  readonly penetrationDepthMm: number;
  readonly shankDiameterMm: number;
  readonly woodGroup: NailWoodGroup;
};

export type NailWithdrawalOutput = {
  readonly withdrawalKg: number;
};

const NAIL_WOOD_GROUP_FACTOR: Record<NailWoodGroup, number> = {
  hardwood: 1.4,
  softwood: 1.0,
};

export const nailWithdrawalExample = {
  input: {
    penetrationDepthMm: 40,
    shankDiameterMm: 3,
    woodGroup: "softwood",
  },
  output: { withdrawalKg: 120 },
} satisfies ToolExample<NailWithdrawalInput, NailWithdrawalOutput>;

export const nailWithdrawalTool = createSimpleTool({
  id: "carpentry/nagel-zugfestigkeit-lookup",
  title: "Nail Withdrawal Estimate",
  description:
    "Estimate nail withdrawal resistance in kilograms from shank diameter, penetration depth, and wood group.",
  inputs: [
    {
      description: "Nail shank diameter in millimetres.",
      id: "shankDiameterMm",
      kind: "number",
      label: "Shank diameter",
      unit: "mm",
    },
    {
      description: "Penetration depth in the wood in millimetres.",
      id: "penetrationDepthMm",
      kind: "number",
      label: "Penetration depth",
      unit: "mm",
    },
    {
      description:
        "Wood group: softwood (factor 1.0) or hardwood (factor 1.4).",
      enum: ["softwood", "hardwood"],
      id: "woodGroup",
      kind: "string",
      label: "Wood group",
    },
  ],
  outputs: [
    {
      description: "Estimated withdrawal resistance in kilograms.",
      format: "mass",
      id: "withdrawalKg",
      kind: "number",
      label: "Withdrawal resistance",
      unit: "kg",
    },
  ],
  calculate: (input) => {
    const shankDiameterMm = input.shankDiameterMm as number;
    if (!(shankDiameterMm > 0))
      simpleError(
        "shankDiameterMm",
        "The shank diameter must be greater than zero millimetres.",
        "invalid_diameter",
      );
    const penetrationDepthMm = input.penetrationDepthMm as number;
    if (!(penetrationDepthMm > 0))
      simpleError(
        "penetrationDepthMm",
        "The penetration depth must be greater than zero millimetres.",
        "invalid_depth",
      );
    return {
      withdrawalKg:
        shankDiameterMm *
        penetrationDepthMm *
        NAIL_WOOD_GROUP_FACTOR[input.woodGroup as NailWoodGroup],
    };
  },
});
export const runNailWithdrawal = nailWithdrawalTool.execute;
export default nailWithdrawalTool;
