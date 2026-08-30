import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly xIntensity: number;
  readonly yIntensity: number;
  readonly minimumLog2Contrast: number;
}>;
export type Output = Readonly<{
  readonly log2Contrast: number;
  readonly predictedClass: string;
  readonly confident: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.xIntensity <= 0 ||
    input.yIntensity <= 0 ||
    input.minimumLog2Contrast < 0
  )
    simpleError(
      "xIntensity",
      "Signals must be positive and contrast threshold nonnegative.",
    );
  const log2Contrast = Math.log2(input.xIntensity / input.yIntensity),
    confident = Math.abs(log2Contrast) >= input.minimumLog2Contrast;
  return {
    log2Contrast,
    predictedClass: confident
      ? log2Contrast > 0
        ? "x-dominant"
        : "y-dominant"
      : "undetermined",
    confident,
  };
};

export const exampleInput = {
  xIntensity: 800,
  yIntensity: 200,
  minimumLog2Contrast: 1,
} satisfies Input;
export const exampleOutput = {
  log2Contrast: 2,
  predictedClass: "x-dominant",
  confident: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/xy-intensity-classifier",
  title: "XY Intensity Classifier",
  description:
    "Classify X/Y intensity contrast without inferring an individual’s gender.",
  inputs: [
    { id: "xIntensity", kind: "number", label: "X intensity" },
    { id: "yIntensity", kind: "number", label: "Y intensity" },
    {
      id: "minimumLog2Contrast",
      kind: "number",
      label: "Minimum log 2 contrast",
    },
  ],
  outputs: [
    { id: "log2Contrast", kind: "number", label: "Log 2 contrast" },
    {
      id: "predictedClass",
      kind: "string",
      label: "Predicted class",
      enum: ["x-dominant", "y-dominant", "undetermined"],
    },
    { id: "confident", kind: "boolean", label: "Confident" },
  ],
  calculate: (value) =>
    calculate({
      xIntensity: value.xIntensity as number,
      yIntensity: value.yIntensity as number,
      minimumLog2Contrast: value.minimumLog2Contrast as number,
    }),
});
export const run = tool.execute;
export default tool;
