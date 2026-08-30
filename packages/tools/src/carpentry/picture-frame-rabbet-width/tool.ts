import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PictureFrameRabbetWidthInput = Readonly<{
  readonly artworkWidthMm: number;
  readonly totalFitAllowanceMm: number;
  readonly visibleApertureWidthMm: number;
}>;
export type PictureFrameRabbetWidthOutput = Readonly<{
  readonly overlapPerSideMm: number;
}>;

export const calculatePictureFrameRabbetWidth = (
  x: PictureFrameRabbetWidthInput,
): PictureFrameRabbetWidthOutput => {
  if (!Number.isFinite(x.artworkWidthMm) || x.artworkWidthMm < 0)
    simpleError("artworkWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.totalFitAllowanceMm) || x.totalFitAllowanceMm < 0)
    simpleError("totalFitAllowanceMm", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.visibleApertureWidthMm) ||
    x.visibleApertureWidthMm < 0
  )
    simpleError(
      "visibleApertureWidthMm",
      "Provide a finite number at least 0.",
    );
  if (!(x.artworkWidthMm + x.totalFitAllowanceMm >= x.visibleApertureWidthMm))
    simpleError(
      "visibleApertureWidthMm",
      "Visible aperture cannot exceed artwork plus allowance.",
    );
  const overlapPerSideMm =
    (x.artworkWidthMm + x.totalFitAllowanceMm - x.visibleApertureWidthMm) / 2;
  if (!Number.isFinite(overlapPerSideMm))
    simpleError("overlapPerSideMm", "The inputs produce an invalid result.");
  return {
    overlapPerSideMm: Object.is(overlapPerSideMm, -0) ? 0 : overlapPerSideMm,
  };
};

export const example = {
  input: {
    artworkWidthMm: 300,
    totalFitAllowanceMm: 2,
    visibleApertureWidthMm: 290,
  },
  output: { overlapPerSideMm: 6 },
} satisfies ToolExample<
  PictureFrameRabbetWidthInput,
  PictureFrameRabbetWidthOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/picture-frame-rabbet-width",
  title: "Picture Frame Rabbet Width",
  description:
    "Find equal artwork overlap on both sides from artwork plus fit allowance versus the visible frame aperture.",
  inputs: [
    {
      id: "artworkWidthMm",
      kind: "number",
      label: "Artwork width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "totalFitAllowanceMm",
      kind: "number",
      label: "Total fit allowance",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "visibleApertureWidthMm",
      kind: "number",
      label: "Visible opening width",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "overlapPerSideMm",
      kind: "number",
      label: "Rabbet lip overlap per side",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculatePictureFrameRabbetWidth({
      artworkWidthMm: input.artworkWidthMm as number,
      totalFitAllowanceMm: input.totalFitAllowanceMm as number,
      visibleApertureWidthMm: input.visibleApertureWidthMm as number,
    }),
});
export const pictureFrameRabbetWidthTool = tool;
export const runPictureFrameRabbetWidth = tool.execute;
export default tool;
