import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EdgeBandingTrimAllowanceInput = Readonly<{
  readonly bandingWidthMm: number;
  readonly panelThicknessMm: number;
}>;
export type EdgeBandingTrimAllowanceOutput = Readonly<{
  readonly totalTrimMm: number;
  readonly trimPerFaceMm: number;
}>;

export const calculateEdgeBandingTrimAllowance = (
  x: EdgeBandingTrimAllowanceInput,
): EdgeBandingTrimAllowanceOutput => {
  if (!Number.isFinite(x.bandingWidthMm) || x.bandingWidthMm < 0)
    simpleError("bandingWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.panelThicknessMm) || x.panelThicknessMm < 0)
    simpleError("panelThicknessMm", "Provide a finite number at least 0.");
  if (!(x.bandingWidthMm >= x.panelThicknessMm))
    simpleError("bandingWidthMm", "Banding must be at least panel thickness.");
  const totalTrimMm = x.bandingWidthMm - x.panelThicknessMm;
  if (!Number.isFinite(totalTrimMm))
    simpleError("totalTrimMm", "The inputs produce an invalid result.");
  const trimPerFaceMm = (x.bandingWidthMm - x.panelThicknessMm) / 2;
  if (!Number.isFinite(trimPerFaceMm))
    simpleError("trimPerFaceMm", "The inputs produce an invalid result.");
  return {
    totalTrimMm: Object.is(totalTrimMm, -0) ? 0 : totalTrimMm,
    trimPerFaceMm: Object.is(trimPerFaceMm, -0) ? 0 : trimPerFaceMm,
  };
};

export const example = {
  input: { bandingWidthMm: 22, panelThicknessMm: 18 },
  output: { totalTrimMm: 4, trimPerFaceMm: 2 },
} satisfies ToolExample<
  EdgeBandingTrimAllowanceInput,
  EdgeBandingTrimAllowanceOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/edge-banding-trim-allowance",
  title: "Edge Banding Trim Allowance",
  description:
    "Calculate total edge-banding width to trim and the equal amount per face when strip is centered on a panel.",
  inputs: [
    {
      id: "bandingWidthMm",
      kind: "number",
      label: "Banding strip width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "panelThicknessMm",
      kind: "number",
      label: "Panel thickness",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalTrimMm",
      kind: "number",
      label: "Total excess width",
      unit: "mm",
    },
    { id: "trimPerFaceMm", kind: "number", label: "Trim per face", unit: "mm" },
  ],
  calculate: (input) =>
    calculateEdgeBandingTrimAllowance({
      bandingWidthMm: input.bandingWidthMm as number,
      panelThicknessMm: input.panelThicknessMm as number,
    }),
});
export const edgeBandingTrimAllowanceTool = tool;
export const runEdgeBandingTrimAllowance = tool.execute;
export default tool;
