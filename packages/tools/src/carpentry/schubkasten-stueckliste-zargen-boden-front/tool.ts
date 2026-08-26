import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrawerBoxPanelListInput = {
  readonly boxDepthMm: number;
  readonly frontWidthMm: number;
  readonly sideHeightMm: number;
};

export type DrawerBoxPanelListOutput = {
  readonly backCount: number;
  readonly bottomCount: number;
  readonly frontCount: number;
  readonly sideCount: number;
  readonly totalEdgeLengthMm: number;
};

export const drawerBoxPanelListExample = {
  input: { boxDepthMm: 500, frontWidthMm: 400, sideHeightMm: 150 },
  output: {
    backCount: 1,
    bottomCount: 1,
    frontCount: 1,
    sideCount: 2,
    totalEdgeLengthMm: 2100,
  },
} satisfies ToolExample<DrawerBoxPanelListInput, DrawerBoxPanelListOutput>;

export const drawerBoxPanelListTool = createSimpleTool({
  id: "carpentry/schubkasten-stueckliste-zargen-boden-front",
  title: "Drawer Box Panel List Generator",
  description:
    "Compute the panel counts and total edge length for one drawer box from front width, box depth, and side height.",
  inputs: [
    {
      description: "Width of the drawer front in millimetres.",
      id: "frontWidthMm",
      kind: "number",
      label: "Front width",
      unit: "mm",
    },
    {
      description: "Interior depth of the drawer box in millimetres.",
      id: "boxDepthMm",
      kind: "number",
      label: "Box depth",
      unit: "mm",
    },
    {
      description: "Height of the side panels in millimetres.",
      id: "sideHeightMm",
      kind: "number",
      label: "Side height",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "One front panel per drawer box.",
      format: "count",
      id: "frontCount",
      kind: "integer",
      label: "Front count",
    },
    {
      description: "One back panel per drawer box.",
      format: "count",
      id: "backCount",
      kind: "integer",
      label: "Back count",
    },
    {
      description: "Two side panels per drawer box.",
      format: "count",
      id: "sideCount",
      kind: "integer",
      label: "Side count",
    },
    {
      description: "One bottom panel per drawer box.",
      format: "count",
      id: "bottomCount",
      kind: "integer",
      label: "Bottom count",
    },
    {
      description:
        "Exposed edge length over front and back plus both sides: two times the sum of front width, side height, and box depth.",
      format: "length",
      id: "totalEdgeLengthMm",
      kind: "number",
      label: "Total edge length",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const frontWidthMm = input.frontWidthMm as number;
    if (frontWidthMm <= 0)
      simpleError(
        "frontWidthMm",
        "The front width must be greater than zero millimetres.",
        "invalid_front_width",
      );
    const boxDepthMm = input.boxDepthMm as number;
    if (boxDepthMm <= 0)
      simpleError(
        "boxDepthMm",
        "The box depth must be greater than zero millimetres.",
        "invalid_box_depth",
      );
    const sideHeightMm = input.sideHeightMm as number;
    if (sideHeightMm <= 0)
      simpleError(
        "sideHeightMm",
        "The side height must be greater than zero millimetres.",
        "invalid_side_height",
      );
    return {
      backCount: 1,
      bottomCount: 1,
      frontCount: 1,
      sideCount: 2,
      totalEdgeLengthMm: 2 * (frontWidthMm + sideHeightMm + boxDepthMm),
    };
  },
});
export const runDrawerBoxPanelList = drawerBoxPanelListTool.execute;
export default drawerBoxPanelListTool;
