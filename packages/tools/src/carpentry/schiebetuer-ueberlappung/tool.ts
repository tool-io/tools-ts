import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SlidingDoorOverlapInput = {
  readonly doorCount: number;
  readonly overlapPerJunctionMm?: number;
};

export type SlidingDoorOverlapOutput = {
  readonly totalOverlapMm: number;
};

export const slidingDoorOverlapExample = {
  input: { doorCount: 3 },
  output: { totalOverlapMm: 50 },
} satisfies ToolExample<SlidingDoorOverlapInput, SlidingDoorOverlapOutput>;

export const slidingDoorOverlapTool = createSimpleTool({
  id: "carpentry/schiebetuer-ueberlappung",
  title: "Sliding Door Overlap Calculator",
  description:
    "Compute the total overlap consumed by the junctions of a multi-leaf sliding door set.",
  inputs: [
    {
      description: "Number of sliding door leaves in the run.",
      id: "doorCount",
      kind: "integer",
      label: "Door count",
      minimum: 2,
    },
    {
      default: 25,
      description: "Overlap shared by two neighboring leaves at one junction.",
      id: "overlapPerJunctionMm",
      kind: "number",
      label: "Overlap per junction",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description:
        "Total width lost to overlaps across all junctions in millimeters.",
      id: "totalOverlapMm",
      kind: "number",
      label: "Total overlap",
      unit: "mm",
    },
  ],
  calculate: (input) => ({
    totalOverlapMm:
      ((input.doorCount as number) - 1) *
      (input.overlapPerJunctionMm as number),
  }),
});
export const runSlidingDoorOverlap = slidingDoorOverlapTool.execute;
export default slidingDoorOverlapTool;
