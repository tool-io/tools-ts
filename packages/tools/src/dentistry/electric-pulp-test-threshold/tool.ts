import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  binary,
  strictlyIncreasing,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredStimulusLevels: readonly number[];
  readonly actualObservedResponseFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredStimulusLevels",
    label: "Independently measured stimulus levels",
    kind: "numberList",
  },
  {
    id: "actualObservedResponseFlags",
    label: "Actual observed response flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyMeasuredStimulusLevels,
    input.actualObservedResponseFlags,
    "trials",
  );
  strictlyIncreasing(input.independentlyMeasuredStimulusLevels, "levels", 2);
  binary(input.actualObservedResponseFlags, "response");
  const responding = input.independentlyMeasuredStimulusLevels.filter(
    (_, i) => input.actualObservedResponseFlags[i],
  );
  if (!responding.length)
    simpleError(
      "response",
      "No observed threshold; qualified assessment must retain unelicited state externally.",
    );
  const m = Math.min(...responding);
  return {
    lowestObservedRespondingStimulusLevel: m,
    lowerTestedNonresponseLevels:
      input.independentlyMeasuredStimulusLevels.filter(
        (v, i) => v < m && !input.actualObservedResponseFlags[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredStimulusLevels: [10, 20, 30],
    actualObservedResponseFlags: [0, 1, 1],
  },
  output: {
    result: {
      lowestObservedRespondingStimulusLevel: 20,
      lowerTestedNonresponseLevels: [10],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/electric-pulp-test-threshold",
  title: "Electric Pulp Test Threshold Calculator",
  description:
    "Actual lowest tested electric-pulp response level with retained lower nonresponses. Device units, tooth/control/conditions external; not exact biological threshold, pulp vitality or a clinical diagnosis.",
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
