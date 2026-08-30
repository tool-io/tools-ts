import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, count } from "../shared.js";

export type Input = Readonly<{
  readonly residuals: readonly number[];
  readonly sigmaThreshold: number;
  readonly maximumRounds: number;
}>;
export type Output = Readonly<{
  readonly retainedIndexes: readonly number[];
  readonly rejectedIndexes: readonly number[];
  readonly clippingRounds: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.sigmaThreshold, "sigmaThreshold");
  count(input.maximumRounds, "maximumRounds", 1);
  if (
    input.maximumRounds > 100 ||
    input.residuals.length < 2 ||
    input.residuals.length > 10000
  )
    simpleError(
      "residuals",
      "At least two and at most 10000 residuals; at most 100 clipping rounds required.",
    );
  let retainedIndexes = input.residuals.map((_, i) => i),
    clippingRounds = 0;
  for (let round = 0; round < input.maximumRounds; round++) {
    if (retainedIndexes.length < 2) break;
    const mean =
        retainedIndexes.reduce((s, i) => s + input.residuals[i], 0) /
        retainedIndexes.length,
      sd = Math.sqrt(
        retainedIndexes.reduce(
          (s, i) => s + (input.residuals[i] - mean) ** 2,
          0,
        ) /
          (retainedIndexes.length - 1),
      );
    if (sd === 0) break;
    const next = retainedIndexes.filter(
      (i) => Math.abs(input.residuals[i] - mean) <= input.sigmaThreshold * sd,
    );
    if (next.length === retainedIndexes.length) break;
    if (!next.length)
      simpleError("sigmaThreshold", "Clipping would remove every observation.");
    retainedIndexes = next;
    clippingRounds++;
  }
  const kept = new Set(retainedIndexes);
  return {
    retainedIndexes,
    rejectedIndexes: input.residuals.flatMap((_, i) =>
      kept.has(i) ? [] : [i],
    ),
    clippingRounds,
  };
};
export const exampleInput = {
  residuals: [0, 0, 0, 0, 10],
  sigmaThreshold: 1,
  maximumRounds: 10,
} satisfies Input;
export const exampleOutput = {
  retainedIndexes: [0, 1, 2, 3],
  rejectedIndexes: [4],
  clippingRounds: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/iterative-astrometric-sigma-clip",
  title: "Iterative Astrometric Sigma Clip",
  description:
    "Iteratively clip residuals using recalculated sample standard deviation, retaining original indices and a bounded iteration count.",
  inputs: [
    { id: "residuals", label: "Residuals", kind: "numberList" },
    { id: "sigmaThreshold", label: "Sigma threshold", kind: "number" },
    { id: "maximumRounds", label: "Maximum rounds", kind: "integer" },
  ],
  outputs: [
    { id: "retainedIndexes", label: "Retained indexes", kind: "numberList" },
    { id: "rejectedIndexes", label: "Rejected indexes", kind: "numberList" },
    { id: "clippingRounds", label: "Clipping rounds", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      residuals: value.residuals as readonly number[],
      sigmaThreshold: value.sigmaThreshold as number,
      maximumRounds: value.maximumRounds as number,
    }),
});
export const run = tool.execute;
export default tool;
