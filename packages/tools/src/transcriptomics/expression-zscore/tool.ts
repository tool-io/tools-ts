import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly expression: number;
  readonly referenceMean: number;
  readonly referenceStdDev: number;
  readonly colorClipZ: number;
}>;
export type Output = Readonly<{
  readonly zScore: number;
  readonly colorPosition: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.referenceStdDev <= 0 || input.colorClipZ <= 0)
    simpleError(
      "referenceStdDev",
      "Scale and color clipping threshold must be positive.",
    );
  const zScore =
    (input.expression - input.referenceMean) / input.referenceStdDev;
  return {
    zScore,
    colorPosition: Math.max(-1, Math.min(1, zScore / input.colorClipZ)),
  };
};

export const exampleInput = {
  expression: 8,
  referenceMean: 5,
  referenceStdDev: 2,
  colorClipZ: 1,
} satisfies Input;
export const exampleOutput = { zScore: 1.5, colorPosition: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/expression-zscore",
  title: "Expression Zscore",
  description:
    "Map standardized expression to a clipped diverging-color coordinate.",
  inputs: [
    { id: "expression", kind: "number", label: "Expression" },
    { id: "referenceMean", kind: "number", label: "Reference mean" },
    { id: "referenceStdDev", kind: "number", label: "Reference std dev" },
    { id: "colorClipZ", kind: "number", label: "Color clip z" },
  ],
  outputs: [
    { id: "zScore", kind: "number", label: "Z score" },
    { id: "colorPosition", kind: "number", label: "Color position" },
  ],
  calculate: (value) =>
    calculate({
      expression: value.expression as number,
      referenceMean: value.referenceMean as number,
      referenceStdDev: value.referenceStdDev as number,
      colorClipZ: value.colorClipZ as number,
    }),
});
export const run = tool.execute;
export default tool;
