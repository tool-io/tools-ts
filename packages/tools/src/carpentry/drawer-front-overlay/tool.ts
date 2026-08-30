import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrawerFrontOverlayInput = Readonly<{
  readonly frontWidthMm: number;
  readonly openingWidthMm: number;
}>;
export type DrawerFrontOverlayOutput = Readonly<{
  readonly overlayPerSideMm: number;
}>;

export const calculateDrawerFrontOverlay = (
  x: DrawerFrontOverlayInput,
): DrawerFrontOverlayOutput => {
  if (!Number.isFinite(x.frontWidthMm) || x.frontWidthMm < 0)
    simpleError("frontWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.openingWidthMm) || x.openingWidthMm < 0)
    simpleError("openingWidthMm", "Provide a finite number at least 0.");
  if (!(x.frontWidthMm >= x.openingWidthMm))
    simpleError("frontWidthMm", "Front width must be at least opening width.");
  const overlayPerSideMm = (x.frontWidthMm - x.openingWidthMm) / 2;
  if (!Number.isFinite(overlayPerSideMm))
    simpleError("overlayPerSideMm", "The inputs produce an invalid result.");
  return {
    overlayPerSideMm: Object.is(overlayPerSideMm, -0) ? 0 : overlayPerSideMm,
  };
};

export const example = {
  input: { frontWidthMm: 520, openingWidthMm: 500 },
  output: { overlayPerSideMm: 10 },
} satisfies ToolExample<DrawerFrontOverlayInput, DrawerFrontOverlayOutput>;

export const tool = createSimpleTool({
  id: "carpentry/drawer-front-overlay",
  title: "Drawer Front Overlay",
  description:
    "Find equal side overlay of a centered drawer front from front width and clear opening width.",
  inputs: [
    {
      id: "frontWidthMm",
      kind: "number",
      label: "Drawer-front width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "openingWidthMm",
      kind: "number",
      label: "Clear opening width",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "overlayPerSideMm",
      kind: "number",
      label: "Overlay per side",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDrawerFrontOverlay({
      frontWidthMm: input.frontWidthMm as number,
      openingWidthMm: input.openingWidthMm as number,
    }),
});
export const drawerFrontOverlayTool = tool;
export const runDrawerFrontOverlay = tool.execute;
export default tool;
