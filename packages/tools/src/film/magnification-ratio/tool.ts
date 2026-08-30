import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MagnificationRatioInput = Readonly<{
  readonly imageMillimeters: number;
  readonly objectMillimeters: number;
}>;
export type MagnificationRatioOutput = Readonly<{
  readonly magnification: number;
}>;

export const calculateMagnificationRatio = (
  x: MagnificationRatioInput,
): MagnificationRatioOutput => {
  if (!Number.isFinite(x.imageMillimeters) || x.imageMillimeters < 0)
    simpleError("imageMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.objectMillimeters) || x.objectMillimeters < 0)
    simpleError("objectMillimeters", "Provide a finite number at least 0.");
  const magnification = x.imageMillimeters / x.objectMillimeters;
  if (!Number.isFinite(magnification))
    simpleError(
      "magnification",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { magnification: Object.is(magnification, -0) ? 0 : magnification };
};

export const example = {
  input: { imageMillimeters: 10, objectMillimeters: 20 },
  output: { magnification: 0.5 },
} satisfies ToolExample<MagnificationRatioInput, MagnificationRatioOutput>;

export const tool = createSimpleTool({
  id: "film/magnification-ratio",
  title: "Magnification Ratio",
  description:
    "Linear image magnification from image size divided by object size in matching length units.",
  inputs: [
    {
      id: "imageMillimeters",
      kind: "number",
      label: "Image Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "objectMillimeters",
      kind: "number",
      label: "Object Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "magnification", kind: "number", label: "Magnification" }],
  calculate: (input) =>
    calculateMagnificationRatio({
      imageMillimeters: input.imageMillimeters as number,
      objectMillimeters: input.objectMillimeters as number,
    }),
});
export const magnificationRatioTool = tool;
export const runMagnificationRatio = tool.execute;
export default tool;
