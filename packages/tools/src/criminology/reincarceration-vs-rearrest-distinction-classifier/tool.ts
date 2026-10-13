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
    ["rearrest-observed", "reincarceration-observed"],
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
      compatibleClasses: ["rearrest-observed", "reincarceration-observed"],
      witnessedClasses: ["rearrest-observed", "reincarceration-observed"],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/reincarceration-vs-rearrest-distinction-classifier",
  title: "Reincarceration vs Rearrest Distinction Classifier",
  description:
    "Keep rearrest and reincarceration outcomes distinct, not conviction/actual offending inference. Independently established feature columns: independently verified rearrest event, independently verified reincarceration event. Unknown evidence and overlapping candidates retained; not semantic parsing, identity, causation, diagnosis, lawfulness, authenticity or safety determination.",
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
