import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  strictlyIncreasing,
  simpleError,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly independentlyObservedMotifIds: readonly string[];
  readonly independentlyMeasuredPositions: readonly number[];
  readonly queryMotifId: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyObservedMotifIds",
    label: "Independently observed motif ids",
    kind: "stringList",
  },
  {
    id: "independentlyMeasuredPositions",
    label: "Independently measured positions",
    kind: "numberList",
  },
  { id: "queryMotifId", label: "Query motif id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyObservedMotifIds,
    input.independentlyMeasuredPositions,
    "positions",
  );
  strictlyIncreasing(input.independentlyMeasuredPositions, "positions", 1);
  if (
    input.independentlyObservedMotifIds.some((v) => !v.trim()) ||
    !input.queryMotifId.trim()
  )
    simpleError("motifs", "Explicit nonempty independently annotated IDs.");
  const indices = input.independentlyObservedMotifIds.flatMap((v, i) =>
    v === input.queryMotifId ? [i] : [],
  );
  return {
    matchedPositionIndices: indices,
    consecutiveMatchedIntervals: indices
      .slice(1)
      .map(
        (v, i) =>
          input.independentlyMeasuredPositions[v] -
          input.independentlyMeasuredPositions[indices[i]],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyObservedMotifIds: ["a", "b", "a", "a"],
    independentlyMeasuredPositions: [0, 1, 3, 5],
    queryMotifId: "a",
  },
  output: {
    result: {
      matchedPositionIndices: [0, 2, 3],
      consecutiveMatchedIntervals: [3, 2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/visual-rhythm-motif-repetition-interval-counter",
  title: "Visual Rhythm Motif Repetition Interval Counter",
  description:
    "Intervals between actual independently identified matching motifs on one ordered measurement axis; unmatched motifs do not reset the interval. No automatic visual rhythm or aesthetic effect inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
