import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CurrentMirrorRatioInput = {
  readonly mirrorTransistorsAreaRatioNumber?: number;
};

export type CurrentMirrorRatioOutput = {
  readonly currentMirrorRatio: number;
};

export const currentMirrorRatioExample = {
  input: { mirrorTransistorsAreaRatioNumber: 4 },
  output: { currentMirrorRatio: 4 },
} satisfies ToolExample<CurrentMirrorRatioInput, CurrentMirrorRatioOutput>;

export const calculateCurrentMirrorRatio = (
  input: CurrentMirrorRatioInput,
): CurrentMirrorRatioOutput => {
  const mirrorTransistorsAreaRatioNumber =
    input.mirrorTransistorsAreaRatioNumber ?? 1;
  if (!(mirrorTransistorsAreaRatioNumber > 0))
    simpleError(
      "mirrorTransistorsAreaRatioNumber",
      "Area ratio must be positive.",
      "invalid_area_ratio",
    );
  return { currentMirrorRatio: mirrorTransistorsAreaRatioNumber };
};

export const currentMirrorRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateCurrentMirrorRatio(input as unknown as CurrentMirrorRatioInput),
  description:
    "Compute the current mirror output-to-reference ratio from the mirror transistor area ratio, defaulting to 1.",
  id: "electronics/current-mirror-ratio",
  inputs: [
    {
      default: 1,
      id: "mirrorTransistorsAreaRatioNumber",
      kind: "number",
      label: "Area ratio",
      required: false,
    },
  ],
  outputs: [
    {
      id: "currentMirrorRatio",
      kind: "number",
      label: "Current mirror ratio",
      unit: "ratio",
    },
  ],
  title: "Mirror Ratio",
});
export const runCurrentMirrorRatio = currentMirrorRatioTool.execute;
export default currentMirrorRatioTool;
