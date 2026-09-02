import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredChordLengthMeters: number;
  readonly independentlyMeasuredShadowSpeedMetersPerSecond: number;
}>;
export type Output = Readonly<{
  readonly conditionalChordDurationSeconds: number;
}>;
const inputFields = [
  {
    id: "independentlyMeasuredChordLengthMeters",
    label: "Independently measured chord length meters",
    kind: "number",
  },
  {
    id: "independentlyMeasuredShadowSpeedMetersPerSecond",
    label: "Independently measured shadow speed meters per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentlyMeasuredShadowSpeedMetersPerSecond,
    "independentlyMeasuredShadowSpeedMetersPerSecond",
  );
  nonnegative(
    input.independentlyMeasuredChordLengthMeters,
    "independentlyMeasuredChordLengthMeters",
  );
  return {
    conditionalChordDurationSeconds:
      input.independentlyMeasuredChordLengthMeters /
      input.independentlyMeasuredShadowSpeedMetersPerSecond,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyMeasuredChordLengthMeters: 100,
  independentlyMeasuredShadowSpeedMetersPerSecond: 10,
} satisfies Input;
export const exampleOutput = {
  conditionalChordDurationSeconds: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/occultation-chord-duration-calculator",
  title: "Occultation Chord Duration Seconds from Chord Length Calculator",
  description:
    "Occultation specified geometric chord duration under constant independent shadow speed, not central stellar diameter/occulted-object size inference. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalChordDurationSeconds",
      label: "Conditional chord duration seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyMeasuredChordLengthMeters:
        value.independentlyMeasuredChordLengthMeters as number,
      independentlyMeasuredShadowSpeedMetersPerSecond:
        value.independentlyMeasuredShadowSpeedMetersPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
