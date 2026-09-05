import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, featureClasses } from "../batch45-shared.js";
export type Input = Readonly<{
  readonly observedFeatureFlags: readonly number[];
  readonly featureKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedFeatureFlags",
    label: "Observed feature flags",
    kind: "numberList",
  },
  { id: "featureKnownFlags", label: "Feature known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return featureClasses(
    input.observedFeatureFlags,
    input.featureKnownFlags,
    ["replacement-cost-review-candidate"],
    [[1, 1, 0]],
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedFeatureFlags: [1, 1, 0], featureKnownFlags: [1, 1, 1] },
  output: {
    result: {
      compatibleClasses: ["replacement-cost-review-candidate"],
      witnessedClasses: ["replacement-cost-review-candidate"],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/life-replacement-churning-flag-checker",
  title: "Life Replacement Churning Flag Checker",
  description:
    "Restricted replacement/churning review evidence, not a finding of improper intent, unsuitable advice or insurer liability. Independently established columns: independently documented repeat replacement, independently documented additional acquisition cost, independently documented justified client benefit. Unknown observations and overlapping candidates retained; not automatic semantic parsing, proof of identity, fraud, authenticity, compliance or coverage.",
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
