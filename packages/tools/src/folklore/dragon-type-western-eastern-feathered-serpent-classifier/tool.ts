import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, featureClasses } from "../batch44-shared.js";

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
    [
      "European-dragon-context",
      "East-Asian-dragon-context",
      "feathered-serpent-context",
    ],
    [
      [1, -1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
    ],
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedFeatureFlags: [1, 1, 1], featureKnownFlags: [1, 1, 1] },
  output: {
    result: {
      compatibleClasses: [
        "European-dragon-context",
        "East-Asian-dragon-context",
        "feathered-serpent-context",
      ],
      witnessedClasses: [
        "European-dragon-context",
        "East-Asian-dragon-context",
        "feathered-serpent-context",
      ],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/dragon-type-western-eastern-feathered-serpent-classifier",
  title: "Dragon Type Western Eastern Feathered Serpent Classifier",
  description:
    "Classify independently established narrative provenance, not creature morphology or one global dragon lineage. Independently annotated feature columns in order: European source context, East Asian source context, Mesoamerican feathered-serpent source context. Compatible classes are not established identities; unknown evidence retained. No automatic semantic parsing, diagnosis, authenticity or safety determination.",
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
