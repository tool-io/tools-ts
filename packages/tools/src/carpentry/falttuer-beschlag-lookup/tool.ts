import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type FoldingDoorHardwareInput = {
  readonly panelCount: number;
};

export type FoldingDoorHardwareOutput = {
  readonly hingeSets: number;
  readonly topTrackRunners: number;
};

export const foldingDoorHardwareExample = {
  input: { panelCount: 4 },
  output: { hingeSets: 3, topTrackRunners: 2 },
} satisfies ToolExample<FoldingDoorHardwareInput, FoldingDoorHardwareOutput>;

export const foldingDoorHardwareTool = createSimpleTool({
  id: "carpentry/falttuer-beschlag-lookup",
  title: "Folding Door Hardware Count",
  description:
    "Compute hinge sets and top track runners for a folding door panel set.",
  inputs: [
    {
      description: "Number of hinged panels in the folding door.",
      id: "panelCount",
      kind: "integer",
      label: "Panel count",
      minimum: 2,
    },
  ],
  outputs: [
    {
      description: "Number of hinge pairs joining adjacent panels.",
      id: "hingeSets",
      kind: "integer",
      label: "Hinge sets",
    },
    {
      description: "Number of runners required in the top track.",
      id: "topTrackRunners",
      kind: "integer",
      label: "Top track runners",
    },
  ],
  calculate: (input) => ({
    hingeSets: (input.panelCount as number) - 1,
    topTrackRunners: Math.ceil((input.panelCount as number) / 2),
  }),
});
export const runFoldingDoorHardware = foldingDoorHardwareTool.execute;
export default foldingDoorHardwareTool;
