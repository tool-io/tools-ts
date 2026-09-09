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
    ["turn-context-observed", "narrow-context-observed"],
    [
      [1, -1, 1],
      [-1, 1, 1],
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
      compatibleClasses: ["turn-context-observed", "narrow-context-observed"],
      witnessedClasses: ["turn-context-observed", "narrow-context-observed"],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/freezing-of-gait-turn-narrow-trigger-checker",
  title: "Freezing of Gait Turn Narrow Trigger Checker",
  description:
    "Observed freezing-of-gait context inventory, not diagnose Parkinsonsdisease or predict a fall. Actual independently established feature columns: independently reported freezing during turning, independently reported freezing in narrow passage, event history independently reviewed. Unknown and overlapping candidates retained, not automatic diagnosis, causation, predicted performance or safety approval.",
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
