import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MaterialRemovalRateInput = Readonly<{
  readonly cutWidthMillimeters: number;
  readonly cutDepthMillimeters: number;
  readonly feedMillimetersPerMinute: number;
}>;
export type MaterialRemovalRateOutput = Readonly<{
  readonly cubicCentimetersPerMinute: number;
}>;

export const calculateMaterialRemovalRate = (
  x: MaterialRemovalRateInput,
): MaterialRemovalRateOutput => {
  if (!Number.isFinite(x.cutWidthMillimeters) || x.cutWidthMillimeters < 0)
    simpleError("cutWidthMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.cutDepthMillimeters) || x.cutDepthMillimeters < 0)
    simpleError("cutDepthMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.feedMillimetersPerMinute) ||
    x.feedMillimetersPerMinute < 0
  )
    simpleError(
      "feedMillimetersPerMinute",
      "Provide a finite number at least 0.",
    );
  const cubicCentimetersPerMinute =
    (x.cutWidthMillimeters *
      x.cutDepthMillimeters *
      x.feedMillimetersPerMinute) /
    1000;
  if (!Number.isFinite(cubicCentimetersPerMinute))
    simpleError(
      "cubicCentimetersPerMinute",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    cubicCentimetersPerMinute: Object.is(cubicCentimetersPerMinute, -0)
      ? 0
      : cubicCentimetersPerMinute,
  };
};

export const example = {
  input: {
    cutWidthMillimeters: 10,
    cutDepthMillimeters: 2,
    feedMillimetersPerMinute: 500,
  },
  output: { cubicCentimetersPerMinute: 10 },
} satisfies ToolExample<MaterialRemovalRateInput, MaterialRemovalRateOutput>;

export const tool = createSimpleTool({
  id: "engineering/material-removal-rate",
  title: "Material Removal Rate",
  description:
    "Rectangular machining material-removal rate from cut width, axial depth and feed rate; output is cubic centimeters per minute.",
  inputs: [
    {
      id: "cutWidthMillimeters",
      kind: "number",
      label: "Cut Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "cutDepthMillimeters",
      kind: "number",
      label: "Cut Depth Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "feedMillimetersPerMinute",
      kind: "number",
      label: "Feed Millimeters Per Minute",
      unit: "mm/min",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "cubicCentimetersPerMinute",
      kind: "number",
      label: "Cubic Centimeters Per Minute",
      unit: "cm³/min",
    },
  ],
  calculate: (input) =>
    calculateMaterialRemovalRate({
      cutWidthMillimeters: input.cutWidthMillimeters as number,
      cutDepthMillimeters: input.cutDepthMillimeters as number,
      feedMillimetersPerMinute: input.feedMillimetersPerMinute as number,
    }),
});
export const materialRemovalRateTool = tool;
export const runMaterialRemovalRate = tool.execute;
export default tool;
