import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DowelHoleDepthInput = Readonly<{
  readonly dowelLengthMm: number;
  readonly endClearanceEachMm: number;
}>;
export type DowelHoleDepthOutput = Readonly<{
  readonly holeDepthMm: number;
}>;

export const calculateDowelHoleDepth = (
  x: DowelHoleDepthInput,
): DowelHoleDepthOutput => {
  if (!Number.isFinite(x.dowelLengthMm) || x.dowelLengthMm < 0)
    simpleError("dowelLengthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.endClearanceEachMm) || x.endClearanceEachMm < 0)
    simpleError("endClearanceEachMm", "Provide a finite number at least 0.");
  const holeDepthMm = x.dowelLengthMm / 2 + x.endClearanceEachMm;
  if (!Number.isFinite(holeDepthMm))
    simpleError("holeDepthMm", "The inputs produce an invalid result.");
  return { holeDepthMm: Object.is(holeDepthMm, -0) ? 0 : holeDepthMm };
};

export const example = {
  input: { dowelLengthMm: 40, endClearanceEachMm: 2 },
  output: { holeDepthMm: 22 },
} satisfies ToolExample<DowelHoleDepthInput, DowelHoleDepthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/dowel-hole-depth",
  title: "Dowel Hole Depth",
  description:
    "Size each equal dowel hole for a centered dowel plus end clearance on that side.",
  inputs: [
    {
      id: "dowelLengthMm",
      kind: "number",
      label: "Dowel length",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "endClearanceEachMm",
      kind: "number",
      label: "End clearance per hole",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "holeDepthMm", kind: "number", label: "Depth per hole", unit: "mm" },
  ],
  calculate: (input) =>
    calculateDowelHoleDepth({
      dowelLengthMm: input.dowelLengthMm as number,
      endClearanceEachMm: input.endClearanceEachMm as number,
    }),
});
export const dowelHoleDepthTool = tool;
export const runDowelHoleDepth = tool.execute;
export default tool;
