import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  bands,
  binary,
  ratioWeighted,
} from "../shared.js";
export type Input = Readonly<{
  readonly documentedSearchCompletionFlags: readonly number[];
  readonly callerSearchImportanceWeights: readonly number[];
  readonly callerUnresolvedRiskTierLowerEdges: readonly number[];
}>;
export type Output = Readonly<{
  readonly weightedUnresolvedSearchFraction: number;
  readonly callerUnresolvedRiskTierCode: number;
  readonly undocumentedSearchIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "documentedSearchCompletionFlags",
    label: "Documented search completion flags",
    kind: "numberList",
  },
  {
    id: "callerSearchImportanceWeights",
    label: "Caller search importance weights",
    kind: "numberList",
  },
  {
    id: "callerUnresolvedRiskTierLowerEdges",
    label: "Caller unresolved risk tier lower edges",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerSearchImportanceWeights.forEach((v) =>
    positive(v, "callerSearchImportanceWeights"),
  );
  aligned(
    input.documentedSearchCompletionFlags,
    input.callerSearchImportanceWeights,
    "documentedSearchCompletionFlags",
  );
  binary(input.documentedSearchCompletionFlags, "search");
  const unresolved = input.documentedSearchCompletionFlags.map((v) => 1 - v),
    r = ratioWeighted(unresolved, input.callerSearchImportanceWeights);
  return {
    weightedUnresolvedSearchFraction: r,
    callerUnresolvedRiskTierCode: bands(
      input.callerUnresolvedRiskTierLowerEdges,
      r,
    ),
    undocumentedSearchIndices: unresolved.flatMap((v, i) => (v ? [i] : [])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  documentedSearchCompletionFlags: [1, 0, 1],
  callerSearchImportanceWeights: [1, 2, 1],
  callerUnresolvedRiskTierLowerEdges: [0, 0.25, 0.75],
} satisfies Input;
export const exampleOutput = {
  weightedUnresolvedSearchFraction: 0.5,
  callerUnresolvedRiskTierCode: 1,
  undocumentedSearchIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/orphan-works-risk-tier-classifier",
  title: "Orphan Works Risk Tier Classifier",
  description:
    "Map missing documented rights-search steps into caller weighted workflow risk tier; not an orphan-works legal status, diligent-search certification or permission to publish.",
  inputs: inputFields,
  outputs: [
    {
      id: "weightedUnresolvedSearchFraction",
      label: "Weighted unresolved search fraction",
      kind: "number",
    },
    {
      id: "callerUnresolvedRiskTierCode",
      label: "Caller unresolved risk tier code",
      kind: "number",
    },
    {
      id: "undocumentedSearchIndices",
      label: "Undocumented search indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      documentedSearchCompletionFlags:
        value.documentedSearchCompletionFlags as readonly number[],
      callerSearchImportanceWeights:
        value.callerSearchImportanceWeights as readonly number[],
      callerUnresolvedRiskTierLowerEdges:
        value.callerUnresolvedRiskTierLowerEdges as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
