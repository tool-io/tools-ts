import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  positive,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly observedParallelVelocitiesMetersPerSecond: readonly number[];
  readonly observedLateralVelocitiesMetersPerSecond: readonly number[];
  readonly matchedPhaseDurationsSeconds: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedParallelVelocitiesMetersPerSecond",
    label: "Observed parallel velocities meters per second",
    kind: "numberList",
  },
  {
    id: "observedLateralVelocitiesMetersPerSecond",
    label: "Observed lateral velocities meters per second",
    kind: "numberList",
  },
  {
    id: "matchedPhaseDurationsSeconds",
    label: "Matched phase durations seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.observedParallelVelocitiesMetersPerSecond,
    input.observedLateralVelocitiesMetersPerSecond,
    "phases",
  );
  aligned(
    input.observedParallelVelocitiesMetersPerSecond,
    input.matchedPhaseDurationsSeconds,
    "durations",
  );
  input.matchedPhaseDurationsSeconds.forEach((v) => positive(v, "duration"));
  const t = positive(sum(input.matchedPhaseDurationsSeconds), "duration"),
    p = sum(
      input.observedParallelVelocitiesMetersPerSecond.map(
        (v, i) => v * input.matchedPhaseDurationsSeconds[i],
      ),
    ),
    l = sum(
      input.observedLateralVelocitiesMetersPerSecond.map(
        (v, i) => v * input.matchedPhaseDurationsSeconds[i],
      ),
    );
  return {
    observedParallelDisplacementMeters: p,
    observedLateralDisplacementMeters: l,
    timeWeightedParallelVelocityMetersPerSecond: p / t,
    timeWeightedLateralVelocityMetersPerSecond: l / t,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedParallelVelocitiesMetersPerSecond: [3, 4],
    observedLateralVelocitiesMetersPerSecond: [-1, 1],
    matchedPhaseDurationsSeconds: [1, 1],
  },
  output: {
    result: {
      observedParallelDisplacementMeters: 7,
      observedLateralDisplacementMeters: 0,
      timeWeightedParallelVelocityMetersPerSecond: 3.5,
      timeWeightedLateralVelocityMetersPerSecond: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/skate-push-side-velocity-vector-contribution-breakdown",
  title: "Skate Push Side Velocity Vector Contribution Breakdown",
  description:
    "Actual declared-coordinate piecewise-constant skate-velocity decomposition, not causal muscular power or an inferred push-force vector. Signed lateral contributions retained; coordinate calibration and complete disjoint phases external.",
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
