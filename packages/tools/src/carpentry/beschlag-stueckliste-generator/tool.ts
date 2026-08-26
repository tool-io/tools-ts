import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const hardwareBomExample = {
  input: { doorCount: 2, drawerCount: 3 },
  output: { handleCount: 5, hingeCount: 4, slidePairCount: 3 },
} satisfies ToolExample<
  {
    readonly doorCount: number;
    readonly drawerCount: number;
    readonly hingesPerDoor?: number;
  },
  {
    readonly handleCount: number;
    readonly hingeCount: number;
    readonly slidePairCount: number;
  }
>;

export const hardwareBomTool = createSimpleTool({
  id: "carpentry/beschlag-stueckliste-generator",
  title: "Hardware Bill of Materials Generator",
  description:
    "Summarize hinges, handles, and slide pairs required for a given number of doors and drawers.",
  inputs: [
    {
      id: "doorCount",
      kind: "integer",
      label: "Door count",
      minimum: 0,
    },
    {
      id: "drawerCount",
      kind: "integer",
      label: "Drawer count",
      minimum: 0,
    },
    {
      default: 2,
      id: "hingesPerDoor",
      kind: "integer",
      label: "Hinges per door",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "hingeCount", kind: "integer", label: "Hinge count" },
    { id: "handleCount", kind: "integer", label: "Handle count" },
    { id: "slidePairCount", kind: "integer", label: "Slide pair count" },
  ],
  calculate: (input) => {
    const doorCount = input.doorCount as number;
    const drawerCount = input.drawerCount as number;
    const hingesPerDoor = input.hingesPerDoor as number;
    return {
      handleCount: doorCount + drawerCount,
      hingeCount: doorCount * hingesPerDoor,
      slidePairCount: drawerCount,
    };
  },
});
export const runHardwareBom = hardwareBomTool.execute;
export default hardwareBomTool;
