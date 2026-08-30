import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BiscuitSlotDepthInput = Readonly<{
  readonly biscuitWidthMillimeters: number;
  readonly glueClearanceMillimeters: number;
}>;
export type BiscuitSlotDepthOutput = Readonly<{
  readonly slotDepthMillimeters: number;
}>;

export const calculateBiscuitSlotDepth = (
  x: BiscuitSlotDepthInput,
): BiscuitSlotDepthOutput => {
  if (
    !Number.isFinite(x.biscuitWidthMillimeters) ||
    x.biscuitWidthMillimeters < 0
  )
    simpleError(
      "biscuitWidthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.glueClearanceMillimeters) ||
    x.glueClearanceMillimeters < 0
  )
    simpleError(
      "glueClearanceMillimeters",
      "Provide a finite number at least 0.",
    );
  const slotDepthMillimeters =
    x.biscuitWidthMillimeters / 2 + x.glueClearanceMillimeters;
  if (!Number.isFinite(slotDepthMillimeters))
    simpleError(
      "slotDepthMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    slotDepthMillimeters: Object.is(slotDepthMillimeters, -0)
      ? 0
      : slotDepthMillimeters,
  };
};

export const example = {
  input: { biscuitWidthMillimeters: 24, glueClearanceMillimeters: 1 },
  output: { slotDepthMillimeters: 13 },
} satisfies ToolExample<BiscuitSlotDepthInput, BiscuitSlotDepthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/biscuit-slot-depth",
  title: "Biscuit Slot Depth",
  description:
    "Target insertion depth on each side of a centered biscuit joint from biscuit width plus a chosen glue clearance.",
  inputs: [
    {
      id: "biscuitWidthMillimeters",
      kind: "number",
      label: "Biscuit Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "glueClearanceMillimeters",
      kind: "number",
      label: "Glue Clearance Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "slotDepthMillimeters",
      kind: "number",
      label: "Slot Depth Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateBiscuitSlotDepth({
      biscuitWidthMillimeters: input.biscuitWidthMillimeters as number,
      glueClearanceMillimeters: input.glueClearanceMillimeters as number,
    }),
});
export const biscuitSlotDepthTool = tool;
export const runBiscuitSlotDepth = tool.execute;
export default tool;
