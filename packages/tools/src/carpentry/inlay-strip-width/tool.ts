import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InlayStripWidthInput = Readonly<{
  readonly grooveWidthMm: number;
  readonly fitClearanceMm: number;
}>;
export type InlayStripWidthOutput = Readonly<{
  readonly stripWidthMm: number;
}>;

export const calculateInlayStripWidth = (
  x: InlayStripWidthInput,
): InlayStripWidthOutput => {
  if (!Number.isFinite(x.grooveWidthMm) || x.grooveWidthMm < 0)
    simpleError("grooveWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.fitClearanceMm) || x.fitClearanceMm < 0)
    simpleError("fitClearanceMm", "Provide a finite number at least 0.");
  if (!(x.grooveWidthMm >= x.fitClearanceMm))
    simpleError("grooveWidthMm", "Groove must cover the fit clearance.");
  const stripWidthMm = x.grooveWidthMm - x.fitClearanceMm;
  if (!Number.isFinite(stripWidthMm))
    simpleError("stripWidthMm", "The inputs produce an invalid result.");
  return { stripWidthMm: Object.is(stripWidthMm, -0) ? 0 : stripWidthMm };
};

export const example = {
  input: { grooveWidthMm: 8, fitClearanceMm: 0.2 },
  output: { stripWidthMm: 7.8 },
} satisfies ToolExample<InlayStripWidthInput, InlayStripWidthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/inlay-strip-width",
  title: "Inlay Strip Width",
  description:
    "Set inlay-strip cut width from a measured groove width after subtracting a chosen total fit clearance.",
  inputs: [
    {
      id: "grooveWidthMm",
      kind: "number",
      label: "Groove width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "fitClearanceMm",
      kind: "number",
      label: "Total fit clearance",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "stripWidthMm",
      kind: "number",
      label: "Inlay strip width",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateInlayStripWidth({
      grooveWidthMm: input.grooveWidthMm as number,
      fitClearanceMm: input.fitClearanceMm as number,
    }),
});
export const inlayStripWidthTool = tool;
export const runInlayStripWidth = tool.execute;
export default tool;
