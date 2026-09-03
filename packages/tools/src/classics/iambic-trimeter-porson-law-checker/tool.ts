import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, featureClasses } from "../batch43-shared.js";

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
    ["Porson-review-candidate"],
    [[1, 1, 1, 0]],
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedFeatureFlags: [1, 1, 1, 1],
    featureKnownFlags: [1, 1, 1, 1],
  },
  output: {
    result: {
      compatibleClasses: [],
      witnessedClasses: [],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/iambic-trimeter-porson-law-checker",
  title: "Iambic Trimeter Porson Law Checker",
  description:
    "Audit independently established evidence for Iambic Trimeter Porson Law Checker. Feature columns, independently annotated in order: tragic trimeter independently scanned, long penultimate-foot thesis, word ends after this thesis, monosyllable exception independently witnessed. Unknown evidence and compatible classes retained; not automated semantic, historical, identity, legal or safety determination.",
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
