import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrawerBoxDimensionsInput = Readonly<{
  readonly openingWidthMm: number;
  readonly openingHeightMm: number;
  readonly interiorDepthMm: number;
  readonly sideClearanceEachMm: number;
  readonly verticalClearanceMm: number;
  readonly backClearanceMm: number;
}>;
export type DrawerBoxDimensionsOutput = Readonly<{
  readonly boxWidthMm: number;
  readonly boxHeightMm: number;
  readonly boxDepthMm: number;
}>;

export const calculateDrawerBoxDimensions = (
  x: DrawerBoxDimensionsInput,
): DrawerBoxDimensionsOutput => {
  if (!Number.isFinite(x.openingWidthMm) || x.openingWidthMm < 0)
    simpleError("openingWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.openingHeightMm) || x.openingHeightMm < 0)
    simpleError("openingHeightMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.interiorDepthMm) || x.interiorDepthMm < 0)
    simpleError("interiorDepthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.sideClearanceEachMm) || x.sideClearanceEachMm < 0)
    simpleError("sideClearanceEachMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.verticalClearanceMm) || x.verticalClearanceMm < 0)
    simpleError("verticalClearanceMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.backClearanceMm) || x.backClearanceMm < 0)
    simpleError("backClearanceMm", "Provide a finite number at least 0.");
  if (!(
    x.openingWidthMm >= 2 * x.sideClearanceEachMm &&
    x.openingHeightMm >= x.verticalClearanceMm &&
    x.interiorDepthMm >= x.backClearanceMm
  ))
    simpleError("input", "Opening dimensions must cover all clearances.");
  const boxWidthMm = x.openingWidthMm - 2 * x.sideClearanceEachMm;
  if (!Number.isFinite(boxWidthMm))
    simpleError("boxWidthMm", "The inputs produce an invalid result.");
  const boxHeightMm = x.openingHeightMm - x.verticalClearanceMm;
  if (!Number.isFinite(boxHeightMm))
    simpleError("boxHeightMm", "The inputs produce an invalid result.");
  const boxDepthMm = x.interiorDepthMm - x.backClearanceMm;
  if (!Number.isFinite(boxDepthMm))
    simpleError("boxDepthMm", "The inputs produce an invalid result.");
  return {
    boxWidthMm: Object.is(boxWidthMm, -0) ? 0 : boxWidthMm,
    boxHeightMm: Object.is(boxHeightMm, -0) ? 0 : boxHeightMm,
    boxDepthMm: Object.is(boxDepthMm, -0) ? 0 : boxDepthMm,
  };
};

export const example = {
  input: {
    openingWidthMm: 500,
    openingHeightMm: 200,
    interiorDepthMm: 500,
    sideClearanceEachMm: 12,
    verticalClearanceMm: 10,
    backClearanceMm: 20,
  },
  output: { boxWidthMm: 476, boxHeightMm: 190, boxDepthMm: 480 },
} satisfies ToolExample<DrawerBoxDimensionsInput, DrawerBoxDimensionsOutput>;

export const tool = createSimpleTool({
  id: "carpentry/drawer-box-dimensions",
  title: "Drawer Box Dimensions",
  description:
    "Calculate outside drawer-box width, height, and depth from clear cabinet opening and chosen slide, vertical, and back clearances.",
  inputs: [
    {
      id: "openingWidthMm",
      kind: "number",
      label: "Clear opening width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "openingHeightMm",
      kind: "number",
      label: "Clear opening height",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "interiorDepthMm",
      kind: "number",
      label: "Usable cabinet depth",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "sideClearanceEachMm",
      kind: "number",
      label: "Slide clearance per side",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "verticalClearanceMm",
      kind: "number",
      label: "Total vertical clearance",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "backClearanceMm",
      kind: "number",
      label: "Back clearance",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "boxWidthMm",
      kind: "number",
      label: "Outside box width",
      unit: "mm",
    },
    {
      id: "boxHeightMm",
      kind: "number",
      label: "Outside box height",
      unit: "mm",
    },
    {
      id: "boxDepthMm",
      kind: "number",
      label: "Outside box depth",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDrawerBoxDimensions({
      openingWidthMm: input.openingWidthMm as number,
      openingHeightMm: input.openingHeightMm as number,
      interiorDepthMm: input.interiorDepthMm as number,
      sideClearanceEachMm: input.sideClearanceEachMm as number,
      verticalClearanceMm: input.verticalClearanceMm as number,
      backClearanceMm: input.backClearanceMm as number,
    }),
});
export const drawerBoxDimensionsTool = tool;
export const runDrawerBoxDimensions = tool.execute;
export default tool;
