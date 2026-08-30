import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DepthOfFieldNearLimitInput = Readonly<{
  readonly hyperfocalMillimeters: number;
  readonly focusDistanceMillimeters: number;
  readonly focalLengthMillimeters: number;
}>;
export type DepthOfFieldNearLimitOutput = Readonly<{
  readonly nearLimitMillimeters: number;
}>;

export const calculateDepthOfFieldNearLimit = (
  x: DepthOfFieldNearLimitInput,
): DepthOfFieldNearLimitOutput => {
  if (!Number.isFinite(x.hyperfocalMillimeters) || x.hyperfocalMillimeters < 0)
    simpleError("hyperfocalMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.focusDistanceMillimeters) ||
    x.focusDistanceMillimeters < 0
  )
    simpleError(
      "focusDistanceMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.focalLengthMillimeters) ||
    x.focalLengthMillimeters < 0
  )
    simpleError(
      "focalLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    x.focusDistanceMillimeters <= x.focalLengthMillimeters ||
    x.hyperfocalMillimeters <= x.focalLengthMillimeters
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const nearLimitMillimeters =
    (x.hyperfocalMillimeters * x.focusDistanceMillimeters) /
    (x.hyperfocalMillimeters +
      x.focusDistanceMillimeters -
      x.focalLengthMillimeters);
  if (!Number.isFinite(nearLimitMillimeters))
    simpleError(
      "nearLimitMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    nearLimitMillimeters: Object.is(nearLimitMillimeters, -0)
      ? 0
      : nearLimitMillimeters,
  };
};

export const example = {
  input: {
    hyperfocalMillimeters: 10466.666666666666,
    focusDistanceMillimeters: 2000,
    focalLengthMillimeters: 50,
  },
  output: { nearLimitMillimeters: 1685.9060402684563 },
} satisfies ToolExample<
  DepthOfFieldNearLimitInput,
  DepthOfFieldNearLimitOutput
>;

export const tool = createSimpleTool({
  id: "film/depth-of-field-near-limit",
  title: "Depth Of Field Near Limit",
  description:
    "Thin-lens near depth-of-field limit Hs/[H+(s−f)] from hyperfocal distance, focus distance and focal length in matching units.",
  inputs: [
    {
      id: "hyperfocalMillimeters",
      kind: "number",
      label: "Hyperfocal Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "focusDistanceMillimeters",
      kind: "number",
      label: "Focus Distance Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "focalLengthMillimeters",
      kind: "number",
      label: "Focal Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "nearLimitMillimeters",
      kind: "number",
      label: "Near Limit Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDepthOfFieldNearLimit({
      hyperfocalMillimeters: input.hyperfocalMillimeters as number,
      focusDistanceMillimeters: input.focusDistanceMillimeters as number,
      focalLengthMillimeters: input.focalLengthMillimeters as number,
    }),
});
export const depthOfFieldNearLimitTool = tool;
export const runDepthOfFieldNearLimit = tool.execute;
export default tool;
