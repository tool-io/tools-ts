import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrawerSlideLengthInput = Readonly<{
  readonly interiorDepthMm: number;
  readonly rearClearanceMm: number;
  readonly availableSlideLengthsMm: readonly number[];
}>;
export type DrawerSlideLengthOutput = Readonly<{
  readonly selectedSlideLengthMm: number;
}>;

export const calculateDrawerSlideLength = (
  x: DrawerSlideLengthInput,
): DrawerSlideLengthOutput => {
  if (!Number.isFinite(x.interiorDepthMm) || x.interiorDepthMm < 0)
    simpleError("interiorDepthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.rearClearanceMm) || x.rearClearanceMm < 0)
    simpleError("rearClearanceMm", "Provide a finite number at least 0.");
  if (
    !Array.isArray(x.availableSlideLengthsMm) ||
    !x.availableSlideLengthsMm.every(
      (v) => typeof v === "number" && Number.isFinite(v),
    )
  )
    simpleError("availableSlideLengthsMm", "Provide a finite number list.");
  if (!(
    x.availableSlideLengthsMm.length > 0 &&
    x.availableSlideLengthsMm.every((v) => v > 0) &&
    x.availableSlideLengthsMm.some(
      (v) => v <= x.interiorDepthMm - x.rearClearanceMm,
    )
  ))
    simpleError(
      "availableSlideLengthsMm",
      "Provide at least one positive slide length that fits.",
    );
  const selectedSlideLengthMm = Math.max(
    ...x.availableSlideLengthsMm.filter(
      (v) => v <= x.interiorDepthMm - x.rearClearanceMm,
    ),
  );
  if (!Number.isFinite(selectedSlideLengthMm))
    simpleError(
      "selectedSlideLengthMm",
      "The inputs produce an invalid result.",
    );
  return {
    selectedSlideLengthMm: Object.is(selectedSlideLengthMm, -0)
      ? 0
      : selectedSlideLengthMm,
  };
};

export const example = {
  input: {
    interiorDepthMm: 320,
    rearClearanceMm: 10,
    availableSlideLengthsMm: [250, 300, 350],
  },
  output: { selectedSlideLengthMm: 300 },
} satisfies ToolExample<DrawerSlideLengthInput, DrawerSlideLengthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/drawer-slide-length",
  title: "Drawer Slide Length",
  description:
    "Choose the longest supplied drawer-slide size that fits usable cabinet depth after rear clearance; no manufacturer sizes are assumed.",
  inputs: [
    {
      id: "interiorDepthMm",
      kind: "number",
      label: "Cabinet interior depth",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "rearClearanceMm",
      kind: "number",
      label: "Required rear clearance",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "availableSlideLengthsMm",
      kind: "numberList",
      label: "Available slide lengths",
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "selectedSlideLengthMm",
      kind: "number",
      label: "Longest fitting slide",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDrawerSlideLength({
      interiorDepthMm: input.interiorDepthMm as number,
      rearClearanceMm: input.rearClearanceMm as number,
      availableSlideLengthsMm:
        input.availableSlideLengthsMm as readonly number[],
    }),
});
export const drawerSlideLengthTool = tool;
export const runDrawerSlideLength = tool.execute;
export default tool;
