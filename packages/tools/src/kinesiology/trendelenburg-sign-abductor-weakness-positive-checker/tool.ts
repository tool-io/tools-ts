import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, featureClasses } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyObservedFeatureFlags: readonly number[];
  readonly featureKnownFlags: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyObservedFeatureFlags",
    label: "Independently observed feature flags",
    kind: "numberList",
  },
  { id: "featureKnownFlags", label: "Feature known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return featureClasses(
    input.independentlyObservedFeatureFlags,
    input.featureKnownFlags,
    ["Trendelenburg-sign-observation-review"],
    [[1, 1]],
  );
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyObservedFeatureFlags: [1, 1],
    featureKnownFlags: [1, 1],
  },
  output: {
    result: {
      compatibleClasses: ["Trendelenburg-sign-observation-review"],
      witnessedClasses: ["Trendelenburg-sign-observation-review"],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/trendelenburg-sign-abductor-weakness-positive-checker",
  title: "Trendelenburg Sign Abductor Weakness Positive Checker",
  description:
    "Record actual independently assessed sign premises, not infer hip-abductor weakness from appearance alone. Actual independently established feature columns: independently observed contralateral pelvic drop in the stated task, stance/trunk context independently assessed. Unknown and overlapping candidates retained, not automatic diagnosis, causation, predicted performance or safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
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
