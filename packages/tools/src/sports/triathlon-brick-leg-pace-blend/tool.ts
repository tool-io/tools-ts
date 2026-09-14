import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
  aligned,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualLegDistancesKm: readonly number[];
  readonly actualLegElapsedSeconds: readonly number[];
  readonly actualTransitionSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLegDistancesKm",
    label: "Actual leg distances km",
    kind: "numberList",
  },
  {
    id: "actualLegElapsedSeconds",
    label: "Actual leg elapsed seconds",
    kind: "numberList",
  },
  {
    id: "actualTransitionSeconds",
    label: "Actual transition seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  aligned(input.actualLegDistancesKm, input.actualLegElapsedSeconds, "legs");
  input.actualLegDistancesKm.forEach((v) => positive(v, "distance"));
  input.actualLegElapsedSeconds.forEach((v) => nonnegative(v, "time"));
  nonnegative(input.actualTransitionSeconds, "transition");
  return {
    totalEventSeconds:
      sum(input.actualLegElapsedSeconds) + input.actualTransitionSeconds,
    transitionExcludedBlendedSecondsPerKm:
      sum(input.actualLegElapsedSeconds) / sum(input.actualLegDistancesKm),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualLegDistancesKm: [1, 2],
    actualLegElapsedSeconds: [100, 300],
    actualTransitionSeconds: 20,
  },
  output: {
    result: {
      totalEventSeconds: 420,
      transitionExcludedBlendedSecondsPerKm: 133.33333333333334,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/triathlon-brick-leg-pace-blend",
  title: "Triathlon Brick Leg Pace Blend",
  description:
    "Actualunequal-legdistance/timeblendweightedtotalpacewithseparatetransitions,not unweightedlegpaceaverage or prescribedtraining. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
