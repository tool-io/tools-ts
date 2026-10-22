import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, featureClasses } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyObservedFeatureFlags: readonly number[];
  readonly featureEvidenceKnownFlags: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyObservedFeatureFlags",
    label: "Independently observed feature flags",
    kind: "numberList",
  },
  {
    id: "featureEvidenceKnownFlags",
    label: "Feature evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return featureClasses(
    input.independentlyObservedFeatureFlags,
    input.featureEvidenceKnownFlags,
    ["canyon-compatible", "tube-compatible"],
    [
      [1, -1],
      [-1, 1],
    ],
  );
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyObservedFeatureFlags: [1, 1],
    featureEvidenceKnownFlags: [1, 1],
  },
  output: {
    result: {
      compatibleClasses: ["canyon-compatible", "tube-compatible"],
      witnessedClasses: ["canyon-compatible", "tube-compatible"],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/canyon-tube-shape-classifier",
  title: "Canyon vs Tube Passage Shape Classifier",
  description:
    "Annotated passage morphology evidence, can overlap; not causal hydrological origin automatically inferred. Actual qualified binary feature columns: independently observed narrow tall incised profile, independently observed rounded profile. Unknowns/overlaps retained; no automatic physical identity, diagnosis or safe-use approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          compatibleClasses: { type: "array", items: { type: "string" } },
          witnessedClasses: { type: "array", items: { type: "string" } },
          unknownFeatureIndices: { type: "array", items: { type: "number" } },
        },
        required: [
          "compatibleClasses",
          "witnessedClasses",
          "unknownFeatureIndices",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
