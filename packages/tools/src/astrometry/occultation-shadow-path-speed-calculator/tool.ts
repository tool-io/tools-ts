import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  shape,
  strictlyIncreasing,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedPlanarShadowPositionsMeters: readonly (readonly number[])[];
  readonly observedTimeOffsetsSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly segmentShadowSpeedsMetersPerSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPlanarShadowPositionsMeters",
    label: "Observed planar shadow positions meters",
    kind: "matrix",
  },
  {
    id: "observedTimeOffsetsSeconds",
    label: "Observed time offsets seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedTimeOffsetsSeconds,
    input.observedPlanarShadowPositionsMeters,
    "observedTimeOffsetsSeconds",
  );
  strictlyIncreasing(input.observedTimeOffsetsSeconds, "times");
  if (shape(input.observedPlanarShadowPositionsMeters, "positions") !== 2)
    simpleError("positions", "Local planar x, ypositions.");
  return {
    segmentShadowSpeedsMetersPerSecond: input.observedTimeOffsetsSeconds
      .slice(1)
      .map(
        (v, i) =>
          Math.hypot(
            input.observedPlanarShadowPositionsMeters[i + 1][0] -
              input.observedPlanarShadowPositionsMeters[i][0],
            input.observedPlanarShadowPositionsMeters[i + 1][1] -
              input.observedPlanarShadowPositionsMeters[i][1],
          ) /
          (v - input.observedTimeOffsetsSeconds[i]),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPlanarShadowPositionsMeters: [
    [0, 0],
    [3, 4],
  ],
  observedTimeOffsetsSeconds: [0, 2],
} satisfies Input;
export const exampleOutput = {
  segmentShadowSpeedsMetersPerSecond: [2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/occultation-shadow-path-speed-calculator",
  title: "Occultation Shadow Path Ground Speed m/s Calculator",
  description:
    "Actual local planar occultation shadow segment speeds, not Earth surface mapping or geodesy. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "segmentShadowSpeedsMetersPerSecond",
      label: "Segment shadow speeds meters per second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPlanarShadowPositionsMeters:
        value.observedPlanarShadowPositionsMeters as readonly (readonly number[])[],
      observedTimeOffsetsSeconds:
        value.observedTimeOffsetsSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
