import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AspectRatioFromResolutionInput = Readonly<{
  readonly widthPixels: number;
  readonly heightPixels: number;
}>;
export type AspectRatioFromResolutionOutput = Readonly<{
  readonly widthToHeightRatio: number;
}>;

export const calculateAspectRatioFromResolution = (
  x: AspectRatioFromResolutionInput,
): AspectRatioFromResolutionOutput => {
  if (!Number.isFinite(x.widthPixels) || x.widthPixels < 1)
    simpleError("widthPixels", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.heightPixels) || x.heightPixels < 1)
    simpleError("heightPixels", "Provide a finite number at least 1.");
  if (
    !Number.isSafeInteger(x.widthPixels) ||
    !Number.isSafeInteger(x.heightPixels)
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const widthToHeightRatio = x.widthPixels / x.heightPixels;
  if (!Number.isFinite(widthToHeightRatio))
    simpleError(
      "widthToHeightRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    widthToHeightRatio: Object.is(widthToHeightRatio, -0)
      ? 0
      : widthToHeightRatio,
  };
};

export const example = {
  input: { widthPixels: 1920, heightPixels: 1080 },
  output: { widthToHeightRatio: 1.7777777777777777 },
} satisfies ToolExample<
  AspectRatioFromResolutionInput,
  AspectRatioFromResolutionOutput
>;

export const tool = createSimpleTool({
  id: "film/aspect-ratio-from-resolution",
  title: "Aspect Ratio From Resolution",
  description:
    "Display width-to-height aspect ratio from integer pixel dimensions; does not simplify to a fraction.",
  inputs: [
    {
      id: "widthPixels",
      kind: "integer",
      label: "Width Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "heightPixels",
      kind: "integer",
      label: "Height Pixels",
      unit: "px",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "widthToHeightRatio",
      kind: "number",
      label: "Width To Height Ratio",
    },
  ],
  calculate: (input) =>
    calculateAspectRatioFromResolution({
      widthPixels: input.widthPixels as number,
      heightPixels: input.heightPixels as number,
    }),
});
export const aspectRatioFromResolutionTool = tool;
export const runAspectRatioFromResolution = tool.execute;
export default tool;
