import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KantenAnleimerUeberstand1mmFraesenInput = Readonly<{
  readonly panelThicknessMm: number;
}>;
export type KantenAnleimerUeberstand1mmFraesenOutput = Readonly<{
  readonly bandingWidthMm: number;
}>;

export const calculateKantenAnleimerUeberstand1mmFraesen = (
  x: KantenAnleimerUeberstand1mmFraesenInput,
): KantenAnleimerUeberstand1mmFraesenOutput => {
  if (!Number.isFinite(x.panelThicknessMm) || x.panelThicknessMm < 0)
    simpleError("panelThicknessMm", "Provide a finite number at least 0.");
  const bandingWidthMm = x.panelThicknessMm + 2;
  if (!Number.isFinite(bandingWidthMm))
    simpleError(
      "bandingWidthMm",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { bandingWidthMm: Object.is(bandingWidthMm, -0) ? 0 : bandingWidthMm };
};

export const example = {
  input: { panelThicknessMm: 18 },
  output: { bandingWidthMm: 20 },
} satisfies ToolExample<
  KantenAnleimerUeberstand1mmFraesenInput,
  KantenAnleimerUeberstand1mmFraesenOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/kanten-anleimer-ueberstand-1mm-fraesen",
  title: "Kanten Anleimer Ueberstand 1mm Fraesen",
  description:
    "Edge-banding width needed for a panel thickness with 1 mm trimming overhang on both faces.",
  inputs: [
    {
      id: "panelThicknessMm",
      kind: "number",
      label: "Panel Thickness Mm",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "bandingWidthMm",
      kind: "number",
      label: "Banding Width Mm",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateKantenAnleimerUeberstand1mmFraesen({
      panelThicknessMm: input.panelThicknessMm as number,
    }),
});
export const kantenAnleimerUeberstand1mmFraesenTool = tool;
export const runKantenAnleimerUeberstand1mmFraesen = tool.execute;
export default tool;
