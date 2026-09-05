import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, similarity } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly candidateAnnotatedAttributes: readonly string[];
  readonly referenceAnnotatedAttributes: readonly string[];
  readonly callerWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "candidateAnnotatedAttributes",
    label: "Candidate annotated attributes",
    kind: "stringList",
  },
  {
    id: "referenceAnnotatedAttributes",
    label: "Reference annotated attributes",
    kind: "stringList",
  },
  { id: "callerWeights", label: "Caller weights", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return similarity(
    input.candidateAnnotatedAttributes,
    input.referenceAnnotatedAttributes,
    input.callerWeights,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    candidateAnnotatedAttributes: ["or", "lion"],
    referenceAnnotatedAttributes: ["or", "eagle"],
    callerWeights: [3, 1],
  },
  output: { result: { weightedExactSimilarity: 0.75, differentIndices: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/coat-conflict-heuristic-scorer",
  title: "Coat Similarity Conflict Checking Heuristic Scorer",
  description:
    "Weighted exact similarity of independently aligned armorial attributes; not legal conflict, image recognition or grant clearance.",
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
