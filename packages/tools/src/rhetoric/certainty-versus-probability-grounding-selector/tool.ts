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
    ["deductive-grounding-candidate", "probabilistic-grounding-candidate"],
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
        "deductive-grounding-candidate",
        "probabilistic-grounding-candidate",
      ],
      witnessedClasses: [
        "deductive-grounding-candidate",
        "probabilistic-grounding-candidate",
      ],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/certainty-versus-probability-grounding-selector",
  title: "Certainty Versus Probability Grounding Selector",
  description:
    "Keep independently established derivational/probabilistic evidence separate; no automatic certainty guarantee. Feature columns, independently annotated in order: deductive derivation independently verified, probabilistic calibration independently verified. Unknown evidence and compatible classes retained; not automated semantic, historical, identity, legal or safety determination.",
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
