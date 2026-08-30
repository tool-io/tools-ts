import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly qResiduals: readonly number[];
  readonly maximumResidual: number;
}>;
export type Output = Readonly<{
  readonly flaggedIndexes: readonly number[];
  readonly largestResidual: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.qResiduals.length === 0 ||
    input.qResiduals.some((v) => v < 0) ||
    input.maximumResidual < 0
  )
    simpleError("qResiduals", "Nonnegative Q residuals and maximum required.");
  return {
    flaggedIndexes: input.qResiduals.flatMap((v, i) =>
      v > input.maximumResidual ? [i] : [],
    ),
    largestResidual: Math.max(...input.qResiduals),
  };
};
export const exampleInput = {
  qResiduals: [1, 4, 2],
  maximumResidual: 3,
} satisfies Input;
export const exampleOutput = {
  flaggedIndexes: [1],
  largestResidual: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/q-residual-gate",
  title: "Q Residual Gate",
  description:
    "Flag samples exceeding a caller-selected Q-residual model-fit limit.",
  inputs: [
    { id: "qResiduals", kind: "numberList", label: "Q residuals" },
    { id: "maximumResidual", kind: "number", label: "Maximum residual" },
  ],
  outputs: [
    { id: "flaggedIndexes", kind: "numberList", label: "Flagged indexes" },
    { id: "largestResidual", kind: "number", label: "Largest residual" },
  ],
  calculate: (value) =>
    calculate({
      qResiduals: value.qResiduals as readonly number[],
      maximumResidual: value.maximumResidual as number,
    }),
});
export const run = tool.execute;
export default tool;
