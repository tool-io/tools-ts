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
    ["qualified-ECG-finding-review"],
    [[1, 1, 1]],
  );
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyObservedFeatureFlags: [1, 1, 1],
    featureKnownFlags: [1, 1, 1],
  },
  output: {
    result: {
      compatibleClasses: ["qualified-ECG-finding-review"],
      witnessedClasses: ["qualified-ECG-finding-review"],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/ecg-heart-rate-qrs-vet-interpretation",
  title: "Vet ECG HR QRS Interpretation Tool",
  description:
    "Actual veterinarian ECGfinding evidence screen, not diagnose rhythm from heart rate/QRSalone or interpret a raw tracing. Actual independently established feature columns: independently observed ECGabnormality, actual calibrated tracing context documented, qualified veterinary interpretation recorded. Unknown and overlapping candidates retained, not automatic diagnosis, causation, predicted performance or safety approval.",
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
