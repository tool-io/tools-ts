import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScopeCropFactorInput = Readonly<{
  readonly sourceAspectRatio: number;
  readonly targetAspectRatio: number;
}>;
export type ScopeCropFactorOutput = Readonly<{
  readonly retainedHeightFraction: number;
}>;

export const calculateScopeCropFactor = (
  x: ScopeCropFactorInput,
): ScopeCropFactorOutput => {
  if (!Number.isFinite(x.sourceAspectRatio) || x.sourceAspectRatio < 0)
    simpleError("sourceAspectRatio", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.targetAspectRatio) || x.targetAspectRatio < 0)
    simpleError("targetAspectRatio", "Provide a finite number at least 0.");
  if (x.targetAspectRatio < x.sourceAspectRatio)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const retainedHeightFraction = x.sourceAspectRatio / x.targetAspectRatio;
  if (!Number.isFinite(retainedHeightFraction))
    simpleError(
      "retainedHeightFraction",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    retainedHeightFraction: Object.is(retainedHeightFraction, -0)
      ? 0
      : retainedHeightFraction,
  };
};

export const example = {
  input: { sourceAspectRatio: 1.7777777777777777, targetAspectRatio: 2.39 },
  output: { retainedHeightFraction: 0.7438400743840073 },
} satisfies ToolExample<ScopeCropFactorInput, ScopeCropFactorOutput>;

export const tool = createSimpleTool({
  id: "film/scope-crop-factor",
  title: "Scope Crop Factor",
  description:
    "Fraction of source image height retained when cropping to a wider target aspect ratio at unchanged width.",
  inputs: [
    {
      id: "sourceAspectRatio",
      kind: "number",
      label: "Source Aspect Ratio",
      minimum: 0,
    },
    {
      id: "targetAspectRatio",
      kind: "number",
      label: "Target Aspect Ratio",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "retainedHeightFraction",
      kind: "number",
      label: "Retained Height Fraction",
    },
  ],
  calculate: (input) =>
    calculateScopeCropFactor({
      sourceAspectRatio: input.sourceAspectRatio as number,
      targetAspectRatio: input.targetAspectRatio as number,
    }),
});
export const scopeCropFactorTool = tool;
export const runScopeCropFactor = tool.execute;
export default tool;
