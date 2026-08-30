import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DowelSpacingInput = Readonly<{
  readonly outerCenterSpanMm: number;
  readonly dowelCount: number;
}>;
export type DowelSpacingOutput = Readonly<{
  readonly centerSpacingMm: number;
}>;

export const calculateDowelSpacing = (
  x: DowelSpacingInput,
): DowelSpacingOutput => {
  if (!Number.isFinite(x.outerCenterSpanMm) || x.outerCenterSpanMm < 0)
    simpleError("outerCenterSpanMm", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.dowelCount) || x.dowelCount < 2)
    simpleError("dowelCount", "Provide a safe integer at least 2.");
  if (!(x.dowelCount >= 2))
    simpleError("dowelCount", "At least two dowels are required.");
  const centerSpacingMm = x.outerCenterSpanMm / (x.dowelCount - 1);
  if (!Number.isFinite(centerSpacingMm))
    simpleError("centerSpacingMm", "The inputs produce an invalid result.");
  return {
    centerSpacingMm: Object.is(centerSpacingMm, -0) ? 0 : centerSpacingMm,
  };
};

export const example = {
  input: { outerCenterSpanMm: 300, dowelCount: 4 },
  output: { centerSpacingMm: 100 },
} satisfies ToolExample<DowelSpacingInput, DowelSpacingOutput>;

export const tool = createSimpleTool({
  id: "carpentry/dowel-spacing",
  title: "Dowel Spacing",
  description:
    "Calculate equal center-to-center spacing for dowels whose outermost center positions span a measured length.",
  inputs: [
    {
      id: "outerCenterSpanMm",
      kind: "number",
      label: "First-to-last dowel center span",
      unit: "mm",
      minimum: 0,
    },
    { id: "dowelCount", kind: "integer", label: "Dowel count", minimum: 2 },
  ],
  outputs: [
    {
      id: "centerSpacingMm",
      kind: "number",
      label: "Dowel center spacing",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDowelSpacing({
      outerCenterSpanMm: input.outerCenterSpanMm as number,
      dowelCount: input.dowelCount as number,
    }),
});
export const dowelSpacingTool = tool;
export const runDowelSpacing = tool.execute;
export default tool;
