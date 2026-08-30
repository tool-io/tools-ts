import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DelphiConvergenceInput = {
  readonly convergenceThreshold: number;
  readonly roundMedians: ReadonlyArray<number>;
  readonly roundSpreads: ReadonlyArray<number>;
};

export type DelphiConvergenceOutput = {
  readonly converged: boolean;
  readonly finalMedian: number;
  readonly finalSpread: number;
  readonly roundsCompleted: number;
};

export const trackDelphiConsensusConvergence = (
  input: DelphiConvergenceInput,
): DelphiConvergenceOutput => {
  if (
    !Array.isArray(input.roundMedians) ||
    !Array.isArray(input.roundSpreads) ||
    input.roundMedians.length === 0
  )
    simpleError(
      "roundMedians",
      "At least one median and matching spread are required.",
      "round_data_required",
    );
  if (input.roundMedians.length !== input.roundSpreads.length)
    simpleError(
      "roundSpreads",
      "Each round must have one spread.",
      "round_data_length_mismatch",
    );
  if (
    !Number.isFinite(input.convergenceThreshold) ||
    input.convergenceThreshold < 0
  )
    simpleError(
      "convergenceThreshold",
      "Convergence threshold must be finite and nonnegative.",
      "invalid_convergence_threshold",
    );
  for (const [index, median] of input.roundMedians.entries()) {
    if (!Number.isFinite(median))
      simpleError(
        `roundMedians.${index}`,
        "Round medians must be finite.",
        "invalid_round_median",
      );
    if (
      !Number.isFinite(input.roundSpreads[index]!) ||
      input.roundSpreads[index]! < 0
    )
      simpleError(
        `roundSpreads.${index}`,
        "Round spreads must be finite and nonnegative.",
        "invalid_round_spread",
      );
  }
  const finalMedian = input.roundMedians[input.roundMedians.length - 1]!;
  const finalSpread = input.roundSpreads[input.roundSpreads.length - 1]!;
  return {
    converged: finalSpread <= input.convergenceThreshold,
    finalMedian,
    finalSpread,
    roundsCompleted: input.roundMedians.length,
  };
};

export const delphiConvergenceExample = {
  input: {
    convergenceThreshold: 5,
    roundMedians: [55, 58, 60],
    roundSpreads: [12, 6, 3],
  },
  output: {
    converged: true,
    finalMedian: 60,
    finalSpread: 3,
    roundsCompleted: 3,
  },
} satisfies ToolExample<DelphiConvergenceInput, DelphiConvergenceOutput>;

export const delphiConvergenceTool = createSimpleTool({
  calculate: (input) =>
    trackDelphiConsensusConvergence({
      convergenceThreshold: input.convergenceThreshold as number,
      roundMedians: input.roundMedians as number[],
      roundSpreads: input.roundSpreads as number[],
    }),
  description:
    "Track caller-supplied Delphi round medians and spreads and report convergence when the final spread meets an explicit threshold.",
  id: "futurology/delphi-method-round-consensus-convergence-tracker",
  inputs: [
    {
      id: "convergenceThreshold",
      kind: "number",
      label: "Convergence threshold",
      minimum: 0,
    },
    { id: "roundMedians", kind: "numberList", label: "Round medians" },
    { id: "roundSpreads", kind: "numberList", label: "Round spreads" },
  ],
  outputs: [
    { id: "converged", kind: "boolean", label: "Consensus converged" },
    { id: "finalMedian", kind: "number", label: "Final median" },
    { id: "finalSpread", kind: "number", label: "Final spread", minimum: 0 },
    {
      id: "roundsCompleted",
      kind: "integer",
      label: "Rounds completed",
      minimum: 1,
    },
  ],
  title: "Delphi Method Round Consensus Convergence Tracker",
});

export const runDelphiConvergence = delphiConvergenceTool.execute;
export default delphiConvergenceTool;
