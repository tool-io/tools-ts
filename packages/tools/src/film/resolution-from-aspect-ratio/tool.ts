import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResolutionFromAspectRatioInput = Readonly<{
  readonly heightPixels: number;
  readonly widthToHeightRatio: number;
}>;
export type ResolutionFromAspectRatioOutput = Readonly<{
  readonly widthPixels: number;
}>;

export const calculateResolutionFromAspectRatio = (
  x: ResolutionFromAspectRatioInput,
): ResolutionFromAspectRatioOutput => {
  if (!Number.isFinite(x.heightPixels) || x.heightPixels < 1)
    simpleError("heightPixels", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.widthToHeightRatio) || x.widthToHeightRatio < 0)
    simpleError("widthToHeightRatio", "Provide a finite number at least 0.");
  if (
    !Number.isSafeInteger(x.heightPixels) ||
    x.heightPixels * x.widthToHeightRatio > Number.MAX_SAFE_INTEGER ||
    x.heightPixels * x.widthToHeightRatio < 0.5
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const widthPixels = Math.round(x.heightPixels * x.widthToHeightRatio);
  if (!Number.isFinite(widthPixels))
    simpleError(
      "widthPixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { widthPixels: Object.is(widthPixels, -0) ? 0 : widthPixels };
};

export const example = {
  input: { heightPixels: 1080, widthToHeightRatio: 1.7777777777777777 },
  output: { widthPixels: 1920 },
} satisfies ToolExample<
  ResolutionFromAspectRatioInput,
  ResolutionFromAspectRatioOutput
>;

export const tool = createSimpleTool({
  id: "film/resolution-from-aspect-ratio",
  title: "Resolution From Aspect Ratio",
  description:
    "Rounded integer pixel width required for a given height and positive width-to-height aspect ratio.",
  inputs: [
    {
      id: "heightPixels",
      kind: "integer",
      label: "Height Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "widthToHeightRatio",
      kind: "number",
      label: "Width To Height Ratio",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "widthPixels", kind: "number", label: "Width Pixels", unit: "px" },
  ],
  calculate: (input) =>
    calculateResolutionFromAspectRatio({
      heightPixels: input.heightPixels as number,
      widthToHeightRatio: input.widthToHeightRatio as number,
    }),
});
export const resolutionFromAspectRatioTool = tool;
export const runResolutionFromAspectRatio = tool.execute;
export default tool;
