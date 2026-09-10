import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, correlationKnown } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerCoupleIds: readonly string[];
  readonly independentlyMatchedPartnerOneScores: readonly number[];
  readonly independentlyMatchedPartnerTwoScores: readonly number[];
  readonly pairedEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerCoupleIds", label: "Caller couple ids", kind: "stringList" },
  {
    id: "independentlyMatchedPartnerOneScores",
    label: "Independently matched partner one scores",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedPartnerTwoScores",
    label: "Independently matched partner two scores",
    kind: "numberList",
  },
  {
    id: "pairedEvidenceKnownFlags",
    label: "Paired evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return correlationKnown(
    input.callerCoupleIds,
    input.independentlyMatchedPartnerOneScores,
    input.independentlyMatchedPartnerTwoScores,
    input.pairedEvidenceKnownFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCoupleIds: ["a", "b", "c"],
    independentlyMatchedPartnerOneScores: [1, 2, 3],
    independentlyMatchedPartnerTwoScores: [2, 4, 6],
    pairedEvidenceKnownFlags: [1, 1, 1],
  },
  output: {
    result: {
      observedKnownCorrelation: 1,
      includedCallerIds: ["a", "b", "c"],
      unknownCallerIds: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/assortative-mating-correlation",
  title: "Assortative Mating Correlation Calculator",
  description:
    "Audit actual known couple-pair score correlation by composing existing Pearson calculation while retaining included/unknown IDs. Pairing, score meaning and cohort sampling independently verified; not causal partner selection, identity inference or relationship recommendation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
