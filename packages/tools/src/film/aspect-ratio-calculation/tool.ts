import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AspectRatioCalculationInput = Readonly<{
  readonly widthMillimeters: number;
  readonly heightMillimeters: number;
}>;
export type AspectRatioCalculationOutput = Readonly<{
  readonly widthToHeightRatio: number;
}>;

export const calculateAspectRatioCalculation = (
  x: AspectRatioCalculationInput,
): AspectRatioCalculationOutput => {
  if (!Number.isFinite(x.widthMillimeters) || x.widthMillimeters < 0)
    simpleError("widthMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.heightMillimeters) || x.heightMillimeters < 0)
    simpleError("heightMillimeters", "Provide a finite number at least 0.");
  const widthToHeightRatio = x.widthMillimeters / x.heightMillimeters;
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
  input: { widthMillimeters: 16, heightMillimeters: 9 },
  output: { widthToHeightRatio: 1.7777777777777777 },
} satisfies ToolExample<
  AspectRatioCalculationInput,
  AspectRatioCalculationOutput
>;

export const tool = createSimpleTool({
  id: "film/aspect-ratio-calculation",
  title: "Aspect Ratio Calculation",
  description:
    "Unreduced width-to-height aspect ratio for an image or screen measured in matching units.",
  inputs: [
    {
      id: "widthMillimeters",
      kind: "number",
      label: "Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "heightMillimeters",
      kind: "number",
      label: "Height Millimeters",
      unit: "mm",
      minimum: 0,
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
    calculateAspectRatioCalculation({
      widthMillimeters: input.widthMillimeters as number,
      heightMillimeters: input.heightMillimeters as number,
    }),
});
export const aspectRatioCalculationTool = tool;
export const runAspectRatioCalculation = tool.execute;
export default tool;
