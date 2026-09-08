import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, featureClasses } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyObservedFeatureFlags: readonly number[];
  readonly featureKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyObservedFeatureFlags",
    label: "Independently observed feature flags",
    kind: "numberList",
  },
  { id: "featureKnownFlags", label: "Feature known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return featureClasses(
    input.independentlyObservedFeatureFlags,
    input.featureKnownFlags,
    ["response-observed", "persistent-response-observed"],
    [
      [1, -1, 1],
      [1, 1, 1],
    ],
  );
};
export const calculate = (input: Input): Output => {
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
      compatibleClasses: ["response-observed", "persistent-response-observed"],
      witnessedClasses: ["response-observed", "persistent-response-observed"],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/cold-test-response-checker",
  title: "Cold Test Response Checker",
  description:
    "actual cold-test response evidence screen only; sensibility is not pulp vitality, causation or definitive diagnosis. Actual independently established feature columns: independently observed response, independently observed persistence beyond stimulus, actual control/test conditions verified. Unknown and overlapping candidates retained, not automatic diagnosis, causation, predicted performance or safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
