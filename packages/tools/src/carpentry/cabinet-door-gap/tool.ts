import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CabinetDoorGapInput = Readonly<{
  readonly openingWidthMm: number;
  readonly leftDoorWidthMm: number;
  readonly rightDoorWidthMm: number;
  readonly sideGapEachMm: number;
}>;
export type CabinetDoorGapOutput = Readonly<{
  readonly centerGapMm: number;
}>;

export const calculateCabinetDoorGap = (
  x: CabinetDoorGapInput,
): CabinetDoorGapOutput => {
  if (!Number.isFinite(x.openingWidthMm) || x.openingWidthMm < 0)
    simpleError("openingWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.leftDoorWidthMm) || x.leftDoorWidthMm < 0)
    simpleError("leftDoorWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.rightDoorWidthMm) || x.rightDoorWidthMm < 0)
    simpleError("rightDoorWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.sideGapEachMm) || x.sideGapEachMm < 0)
    simpleError("sideGapEachMm", "Provide a finite number at least 0.");
  if (
    !(
      x.openingWidthMm >=
      x.leftDoorWidthMm + x.rightDoorWidthMm + 2 * x.sideGapEachMm
    )
  )
    simpleError("openingWidthMm", "Opening must fit both doors and side gaps.");
  const centerGapMm =
    x.openingWidthMm -
    x.leftDoorWidthMm -
    x.rightDoorWidthMm -
    2 * x.sideGapEachMm;
  if (!Number.isFinite(centerGapMm))
    simpleError("centerGapMm", "The inputs produce an invalid result.");
  return { centerGapMm: Object.is(centerGapMm, -0) ? 0 : centerGapMm };
};

export const example = {
  input: {
    openingWidthMm: 600,
    leftDoorWidthMm: 290,
    rightDoorWidthMm: 290,
    sideGapEachMm: 2,
  },
  output: { centerGapMm: 16 },
} satisfies ToolExample<CabinetDoorGapInput, CabinetDoorGapOutput>;

export const tool = createSimpleTool({
  id: "carpentry/cabinet-door-gap",
  title: "Cabinet Door Gap",
  description:
    "Calculate the center gap of a pair of inset cabinet doors after subtracting door widths and equal side gaps from the opening.",
  inputs: [
    {
      id: "openingWidthMm",
      kind: "number",
      label: "Cabinet opening width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "leftDoorWidthMm",
      kind: "number",
      label: "Left door width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "rightDoorWidthMm",
      kind: "number",
      label: "Right door width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "sideGapEachMm",
      kind: "number",
      label: "Each outer side gap",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "centerGapMm", kind: "number", label: "Center door gap", unit: "mm" },
  ],
  calculate: (input) =>
    calculateCabinetDoorGap({
      openingWidthMm: input.openingWidthMm as number,
      leftDoorWidthMm: input.leftDoorWidthMm as number,
      rightDoorWidthMm: input.rightDoorWidthMm as number,
      sideGapEachMm: input.sideGapEachMm as number,
    }),
});
export const cabinetDoorGapTool = tool;
export const runCabinetDoorGap = tool.execute;
export default tool;
