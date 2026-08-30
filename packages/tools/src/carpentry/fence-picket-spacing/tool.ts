import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FencePicketSpacingInput = Readonly<{
  readonly clearOpeningMm: number;
  readonly picketCount: number;
  readonly picketWidthMm: number;
}>;
export type FencePicketSpacingOutput = Readonly<{
  readonly equalGapMm: number;
}>;

export const calculateFencePicketSpacing = (
  x: FencePicketSpacingInput,
): FencePicketSpacingOutput => {
  if (!Number.isFinite(x.clearOpeningMm) || x.clearOpeningMm < 0)
    simpleError("clearOpeningMm", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.picketCount) || x.picketCount < 0)
    simpleError("picketCount", "Provide a safe integer at least 0.");
  if (!Number.isFinite(x.picketWidthMm) || x.picketWidthMm < 0)
    simpleError("picketWidthMm", "Provide a finite number at least 0.");
  if (!(x.clearOpeningMm >= x.picketCount * x.picketWidthMm))
    simpleError("clearOpeningMm", "Pickets cannot exceed clear opening.");
  const equalGapMm =
    (x.clearOpeningMm - x.picketCount * x.picketWidthMm) / (x.picketCount + 1);
  if (!Number.isFinite(equalGapMm))
    simpleError("equalGapMm", "The inputs produce an invalid result.");
  return { equalGapMm: Object.is(equalGapMm, -0) ? 0 : equalGapMm };
};

export const example = {
  input: { clearOpeningMm: 1000, picketCount: 9, picketWidthMm: 75 },
  output: { equalGapMm: 32.5 },
} satisfies ToolExample<FencePicketSpacingInput, FencePicketSpacingOutput>;

export const tool = createSimpleTool({
  id: "carpentry/fence-picket-spacing",
  title: "Fence Picket Spacing",
  description:
    "Calculate equal clear gaps between fence posts, pickets, and both ends from opening width and uniform picket width.",
  inputs: [
    {
      id: "clearOpeningMm",
      kind: "number",
      label: "Opening between posts",
      unit: "mm",
      minimum: 0,
    },
    { id: "picketCount", kind: "integer", label: "Picket count", minimum: 0 },
    {
      id: "picketWidthMm",
      kind: "number",
      label: "Picket width",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "equalGapMm", kind: "number", label: "Equal clear gap", unit: "mm" },
  ],
  calculate: (input) =>
    calculateFencePicketSpacing({
      clearOpeningMm: input.clearOpeningMm as number,
      picketCount: input.picketCount as number,
      picketWidthMm: input.picketWidthMm as number,
    }),
});
export const fencePicketSpacingTool = tool;
export const runFencePicketSpacing = tool.execute;
export default tool;
