import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScrewWoodGroup = "hardwood" | "softwood";

export type ScrewPullOutInput = {
  readonly coreDiameterMm: number;
  readonly penetrationDepthMm: number;
  readonly woodGroup: ScrewWoodGroup;
};

export type ScrewPullOutOutput = {
  readonly pullOutKg: number;
};

const SCREW_WOOD_GROUP_FACTOR: Record<ScrewWoodGroup, number> = {
  hardwood: 1.2,
  softwood: 0.8,
};

export const screwPullOutExample = {
  input: {
    coreDiameterMm: 2.5,
    penetrationDepthMm: 30,
    woodGroup: "softwood",
  },
  output: { pullOutKg: 15 },
} satisfies ToolExample<ScrewPullOutInput, ScrewPullOutOutput>;

export const screwPullOutTool = createSimpleTool({
  id: "carpentry/holzschraube-zugfestigkeit-lookup",
  title: "Screw Pull-Out Estimate",
  description:
    "Estimate screw pull-out resistance in kilograms from core diameter, penetration depth, and wood group.",
  inputs: [
    {
      description: "Screw core diameter in millimetres.",
      id: "coreDiameterMm",
      kind: "number",
      label: "Core diameter",
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
        "Wood group: softwood (factor 0.8) or hardwood (factor 1.2).",
      enum: ["softwood", "hardwood"],
      id: "woodGroup",
      kind: "string",
      label: "Wood group",
    },
  ],
  outputs: [
    {
      description: "Estimated pull-out resistance in kilograms.",
      format: "mass",
      id: "pullOutKg",
      kind: "number",
      label: "Pull-out resistance",
      unit: "kg",
    },
  ],
  calculate: (input) => {
    const coreDiameterMm = input.coreDiameterMm as number;
    if (!(coreDiameterMm > 0))
      simpleError(
        "coreDiameterMm",
        "The core diameter must be greater than zero millimetres.",
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
      pullOutKg:
        (coreDiameterMm ** 2 *
          penetrationDepthMm *
          SCREW_WOOD_GROUP_FACTOR[input.woodGroup as ScrewWoodGroup]) /
        10,
    };
  },
});
export const runScrewPullOut = screwPullOutTool.execute;
export default screwPullOutTool;
