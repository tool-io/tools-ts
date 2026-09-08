import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, similarity } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly candidateAttributeIds: readonly string[];
  readonly callerNearestReferenceAttributeIds: readonly string[];
  readonly callerAttributeWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "candidateAttributeIds",
    label: "Candidate attribute ids",
    kind: "stringList",
  },
  {
    id: "callerNearestReferenceAttributeIds",
    label: "Caller nearest reference attribute ids",
    kind: "stringList",
  },
  {
    id: "callerAttributeWeights",
    label: "Caller attribute weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const s = similarity(
    input.candidateAttributeIds,
    input.callerNearestReferenceAttributeIds,
    input.callerAttributeWeights,
  );
  return {
    weightedExactDistinctness: 1 - s.weightedExactSimilarity,
    differingAttributeIndices: s.differentIndices,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    candidateAttributeIds: ["red", "cross"],
    callerNearestReferenceAttributeIds: ["blue", "cross"],
    callerAttributeWeights: [1, 3],
  },
  output: {
    result: { weightedExactDistinctness: 0.25, differingAttributeIndices: [0] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/distinctiveness-heuristic-rater",
  title: "Distinctiveness Uniqueness Heuristic Rater",
  description:
    "Distinctness against an explicitly supplied independently nearest reference using aligned categorical attributes; not universal uniqueness or registry clearance.",
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
