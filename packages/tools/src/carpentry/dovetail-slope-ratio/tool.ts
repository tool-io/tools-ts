import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DovetailSlopeRatioInput = Readonly<{
  readonly verticalDepthMm: number;
  readonly horizontalOffsetMm: number;
}>;
export type DovetailSlopeRatioOutput = Readonly<{
  readonly depthPerOffset: number;
}>;

export const calculateDovetailSlopeRatio = (
  x: DovetailSlopeRatioInput,
): DovetailSlopeRatioOutput => {
  if (!Number.isFinite(x.verticalDepthMm) || x.verticalDepthMm < 0)
    simpleError("verticalDepthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.horizontalOffsetMm) || x.horizontalOffsetMm < 0)
    simpleError("horizontalOffsetMm", "Provide a finite number at least 0.");
  if (!(x.horizontalOffsetMm > 0))
    simpleError("horizontalOffsetMm", "Horizontal offset must be positive.");
  const depthPerOffset = x.verticalDepthMm / x.horizontalOffsetMm;
  if (!Number.isFinite(depthPerOffset))
    simpleError("depthPerOffset", "The inputs produce an invalid result.");
  return { depthPerOffset: Object.is(depthPerOffset, -0) ? 0 : depthPerOffset };
};

export const example = {
  input: { verticalDepthMm: 8, horizontalOffsetMm: 1 },
  output: { depthPerOffset: 8 },
} satisfies ToolExample<DovetailSlopeRatioInput, DovetailSlopeRatioOutput>;

export const tool = createSimpleTool({
  id: "carpentry/dovetail-slope-ratio",
  title: "Dovetail Slope Ratio",
  description:
    "Convert measured dovetail vertical depth and horizontal offset into the traditional N:1 depth-to-offset slope.",
  inputs: [
    {
      id: "verticalDepthMm",
      kind: "number",
      label: "Dovetail depth",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "horizontalOffsetMm",
      kind: "number",
      label: "Horizontal tail offset",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "depthPerOffset", kind: "number", label: "Dovetail slope N:1" },
  ],
  calculate: (input) =>
    calculateDovetailSlopeRatio({
      verticalDepthMm: input.verticalDepthMm as number,
      horizontalOffsetMm: input.horizontalOffsetMm as number,
    }),
});
export const dovetailSlopeRatioTool = tool;
export const runDovetailSlopeRatio = tool.execute;
export default tool;
