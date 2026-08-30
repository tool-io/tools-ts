import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly diameterClassMidpointsCm: readonly number[];
  readonly qSmallToNextLargeClass: number;
  readonly targetTotalStemsPerHa: number;
}>;
export type Output = Readonly<{
  readonly targetClassStemsPerHa: readonly number[];
}>;
const inputFields = [
  {
    id: "diameterClassMidpointsCm",
    label: "Diameter class midpoints cm",
    kind: "numberList",
  },
  {
    id: "qSmallToNextLargeClass",
    label: "Q small to next large class",
    kind: "number",
  },
  {
    id: "targetTotalStemsPerHa",
    label: "Target total stems per ha",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.diameterClassMidpointsCm.forEach((v) =>
    positive(v, "diameterClassMidpointsCm"),
  );
  positive(input.qSmallToNextLargeClass, "qSmallToNextLargeClass");
  nonnegative(input.targetTotalStemsPerHa, "targetTotalStemsPerHa");
  ordered(input.diameterClassMidpointsCm, "diameterClassMidpointsCm");
  if (input.qSmallToNextLargeClass < 1)
    simpleError("q", "q at least one required for descending class targets.");
  const step =
    input.diameterClassMidpointsCm[1] - input.diameterClassMidpointsCm[0];
  if (
    input.diameterClassMidpointsCm.some(
      (v, i) =>
        i > 0 &&
        Math.abs(v - input.diameterClassMidpointsCm[i - 1] - step) >
          1e-9 * Math.max(1, step),
    )
  )
    simpleError(
      "classes",
      "Equally spaced diameter classes required for fixed q.",
    );
  const weights = input.diameterClassMidpointsCm.map(
      (_, i) => input.qSmallToNextLargeClass ** -i,
    ),
    total = weights.reduce((a, b) => a + b, 0);
  return {
    targetClassStemsPerHa: weights.map(
      (v) => (input.targetTotalStemsPerHa * v) / total,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  diameterClassMidpointsCm: [10, 20, 30],
  qSmallToNextLargeClass: 2,
  targetTotalStemsPerHa: 70,
} satisfies Input;
export const exampleOutput = {
  targetClassStemsPerHa: [40, 20, 10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/thinning-rule-q-factor-diameter-step",
  title: "Thinning Q-Factor Diameter Step",
  description:
    "Normalize caller descending geometric q targets over equally spaced diameter classes, conserving supplied total density; these are continuous planning targets, not actual integer trees or an ecological prescription.",
  inputs: inputFields,
  outputs: [
    {
      id: "targetClassStemsPerHa",
      label: "Target class stems per ha",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      diameterClassMidpointsCm:
        value.diameterClassMidpointsCm as readonly number[],
      qSmallToNextLargeClass: value.qSmallToNextLargeClass as number,
      targetTotalStemsPerHa: value.targetTotalStemsPerHa as number,
    }),
});
export const run = tool.execute;
export default tool;
