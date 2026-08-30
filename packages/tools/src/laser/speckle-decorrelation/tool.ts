import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstSpeckleFrame: readonly number[];
  readonly secondSpeckleFrame: readonly number[];
}>;
export type Output = Readonly<{
  readonly correlationCoefficient: number;
  readonly decorrelation: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.firstSpeckleFrame.length;
  if (n < 2 || input.secondSpeckleFrame.length !== n)
    simpleError(
      "firstSpeckleFrame",
      "Frames must be aligned with at least two samples.",
      "invalid_frames",
    );
  const ma = input.firstSpeckleFrame.reduce((a, b) => a + b, 0) / n,
    mb = input.secondSpeckleFrame.reduce((a, b) => a + b, 0) / n;
  let covariance = 0,
    va = 0,
    vb = 0;
  for (let i = 0; i < n; i += 1) {
    const a = input.firstSpeckleFrame[i] - ma,
      b = input.secondSpeckleFrame[i] - mb;
    covariance += a * b;
    va += a * a;
    vb += b * b;
  }
  if (va === 0 || vb === 0)
    simpleError(
      "firstSpeckleFrame",
      "Both frames need intensity variation.",
      "zero_variance",
    );
  const correlationCoefficient = covariance / Math.sqrt(va * vb);
  return { correlationCoefficient, decorrelation: 1 - correlationCoefficient };
};

export const exampleInput = {
  firstSpeckleFrame: [0, 1],
  secondSpeckleFrame: [0, 1],
} satisfies Input;
export const exampleOutput = {
  correlationCoefficient: 1,
  decorrelation: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstSpeckleFrame: input.firstSpeckleFrame as readonly number[],
      secondSpeckleFrame: input.secondSpeckleFrame as readonly number[],
    }),
  description:
    "Calculate frame-to-frame speckle correlation and decorrelation.",
  id: "laser/speckle-decorrelation",
  inputs: [
    {
      id: "firstSpeckleFrame",
      label: "First speckle frame",
      kind: "numberList",
    },
    {
      id: "secondSpeckleFrame",
      label: "Second speckle frame",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "correlationCoefficient",
      label: "Pearson correlation",
      kind: "number",
      minimum: -1,
      maximum: 1,
    },
    {
      id: "decorrelation",
      label: "One minus correlation",
      kind: "number",
      minimum: 0,
      maximum: 2,
    },
  ],
  title: "Speckle Decorrelation",
});

export const run = tool.execute;
export default tool;
