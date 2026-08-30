import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReproductionRatioInput = Readonly<{
  readonly imageMillimeters: number;
  readonly subjectMillimeters: number;
}>;
export type ReproductionRatioOutput = Readonly<{
  readonly reproductionRatio: number;
}>;

export const calculateReproductionRatio = (
  x: ReproductionRatioInput,
): ReproductionRatioOutput => {
  if (!Number.isFinite(x.imageMillimeters) || x.imageMillimeters < 0)
    simpleError("imageMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.subjectMillimeters) || x.subjectMillimeters < 0)
    simpleError("subjectMillimeters", "Provide a finite number at least 0.");
  const reproductionRatio = x.imageMillimeters / x.subjectMillimeters;
  if (!Number.isFinite(reproductionRatio))
    simpleError(
      "reproductionRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    reproductionRatio: Object.is(reproductionRatio, -0) ? 0 : reproductionRatio,
  };
};

export const example = {
  input: { imageMillimeters: 5, subjectMillimeters: 10 },
  output: { reproductionRatio: 0.5 },
} satisfies ToolExample<ReproductionRatioInput, ReproductionRatioOutput>;

export const tool = createSimpleTool({
  id: "film/reproduction-ratio",
  title: "Reproduction Ratio",
  description:
    "Macro reproduction ratio as image size on sensor divided by actual subject size; 1 means life size (1:1).",
  inputs: [
    {
      id: "imageMillimeters",
      kind: "number",
      label: "Image Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "subjectMillimeters",
      kind: "number",
      label: "Subject Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "reproductionRatio", kind: "number", label: "Reproduction Ratio" },
  ],
  calculate: (input) =>
    calculateReproductionRatio({
      imageMillimeters: input.imageMillimeters as number,
      subjectMillimeters: input.subjectMillimeters as number,
    }),
});
export const reproductionRatioTool = tool;
export const runReproductionRatio = tool.execute;
export default tool;
