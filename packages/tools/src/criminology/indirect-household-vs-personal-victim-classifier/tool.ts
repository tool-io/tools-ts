import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, featureClasses } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedFeatureFlags: readonly number[];
  readonly featureKnownFlags: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "observedFeatureFlags",
    label: "Observed feature flags",
    kind: "numberList",
  },
  { id: "featureKnownFlags", label: "Feature known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return featureClasses(
    input.observedFeatureFlags,
    input.featureKnownFlags,
    ["personal-observation", "household-observation"],
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
  input: { observedFeatureFlags: [1, 1], featureKnownFlags: [1, 1] },
  output: {
    result: {
      compatibleClasses: ["personal-observation", "household-observation"],
      witnessedClasses: ["personal-observation", "household-observation"],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/indirect-household-vs-personal-victim-classifier",
  title: "Indirect Household vs Personal Victim Classifier",
  description:
    "Record independently classified level of victimization observation; coexistence allowed and no direct/indirect identity inference. Independently established feature columns: personal victimization independently established, household-level victimization independently established. Unknown evidence and overlapping candidates retained; not semantic parsing, identity, causation, diagnosis, lawfulness, authenticity or safety determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
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
