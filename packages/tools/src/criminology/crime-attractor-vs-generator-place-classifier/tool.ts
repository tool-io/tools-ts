import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, featureClasses } from "../batch46-shared.js";
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
    ["generator-evidence-candidate", "attractor-evidence-candidate"],
    [
      [1, -1],
      [-1, 1],
    ],
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedFeatureFlags: [1, 1], featureKnownFlags: [1, 1] },
  output: {
    result: {
      compatibleClasses: [
        "generator-evidence-candidate",
        "attractor-evidence-candidate",
      ],
      witnessedClasses: [
        "generator-evidence-candidate",
        "attractor-evidence-candidate",
      ],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/crime-attractor-vs-generator-place-classifier",
  title: "Crime Attractor vs Generator Place Classifier",
  description:
    "Research-context place observations, not presume unlawful behavior from venue type. Independently established feature columns: independently established visitor/activity generator evidence, independently established purposeful offender-attraction evidence. Unknown evidence and overlapping candidates retained; not semantic parsing, identity, causation, diagnosis, lawfulness, authenticity or safety determination.",
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
