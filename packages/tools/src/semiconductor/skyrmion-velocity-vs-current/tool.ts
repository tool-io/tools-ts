import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedSkyrmionCurrentDensities: readonly number[];
  readonly observedSkyrmionDisplacementsM: readonly number[];
  readonly observedMatchedTrackingDurationsSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedSkyrmionVelocitiesMSecond: readonly number[];
  readonly fittedVelocityPerCurrentDensity: number;
  readonly velocityFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedSkyrmionCurrentDensities",
    label: "Observed skyrmion current densities",
    kind: "numberList",
  },
  {
    id: "observedSkyrmionDisplacementsM",
    label: "Observed skyrmion displacements m",
    kind: "numberList",
  },
  {
    id: "observedMatchedTrackingDurationsSeconds",
    label: "Observed matched tracking durations seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedTrackingDurationsSeconds.forEach((v) =>
    positive(v, "observedMatchedTrackingDurationsSeconds"),
  );
  aligned(
    input.observedSkyrmionCurrentDensities,
    input.observedSkyrmionDisplacementsM,
    "observedSkyrmionCurrentDensities",
  );
  aligned(
    input.observedSkyrmionCurrentDensities,
    input.observedMatchedTrackingDurationsSeconds,
    "observedSkyrmionCurrentDensities",
  );
  const velocities = input.observedSkyrmionDisplacementsM.map(
      (v, i) => v / input.observedMatchedTrackingDurationsSeconds[i],
    ),
    fit = linearFit(input.observedSkyrmionCurrentDensities, velocities);
  return {
    observedSkyrmionVelocitiesMSecond: velocities,
    fittedVelocityPerCurrentDensity: fit.slope,
    velocityFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSkyrmionCurrentDensities: [1, 2, 3],
  observedSkyrmionDisplacementsM: [2, 6, 12],
  observedMatchedTrackingDurationsSeconds: [1, 2, 3],
} satisfies Input;
export const exampleOutput = {
  observedSkyrmionVelocitiesMSecond: [2, 3, 4],
  fittedVelocityPerCurrentDensity: 1,
  velocityFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/skyrmion-velocity-vs-current",
  title: "Semiconductor Skyrmion Velocity Vs Current Calculator",
  description:
    "Extract actual signed tracked skyrmion velocities and current-density slope, no predicted universal Hall trajectory or drive-current advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSkyrmionVelocitiesMSecond",
      label: "Observed skyrmion velocities m second",
      kind: "numberList",
    },
    {
      id: "fittedVelocityPerCurrentDensity",
      label: "Fitted velocity per current density",
      kind: "number",
    },
    {
      id: "velocityFitRSquared",
      label: "Velocity fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSkyrmionCurrentDensities:
        value.observedSkyrmionCurrentDensities as readonly number[],
      observedSkyrmionDisplacementsM:
        value.observedSkyrmionDisplacementsM as readonly number[],
      observedMatchedTrackingDurationsSeconds:
        value.observedMatchedTrackingDurationsSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
