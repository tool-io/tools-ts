import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedRoundTripSeconds: number;
  readonly callerPathPropagationSpeedMetersPerSecond: number;
  readonly independentRoundTripTimeSigmaSeconds: number;
}>;
export type Output = Readonly<{
  readonly conditionalOneWayDistanceCm: number;
  readonly conditionalRangeSigmaCm: number;
}>;
const inputFields = [
  {
    id: "observedRoundTripSeconds",
    label: "Observed round trip seconds",
    kind: "number",
  },
  {
    id: "callerPathPropagationSpeedMetersPerSecond",
    label: "Caller path propagation speed meters per second",
    kind: "number",
  },
  {
    id: "independentRoundTripTimeSigmaSeconds",
    label: "Independent round trip time sigma seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerPathPropagationSpeedMetersPerSecond,
    "callerPathPropagationSpeedMetersPerSecond",
  );
  nonnegative(input.observedRoundTripSeconds, "observedRoundTripSeconds");
  nonnegative(
    input.independentRoundTripTimeSigmaSeconds,
    "independentRoundTripTimeSigmaSeconds",
  );
  return {
    conditionalOneWayDistanceCm:
      input.observedRoundTripSeconds *
      input.callerPathPropagationSpeedMetersPerSecond *
      50,
    conditionalRangeSigmaCm:
      input.independentRoundTripTimeSigmaSeconds *
      input.callerPathPropagationSpeedMetersPerSecond *
      50,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRoundTripSeconds: 2,
  callerPathPropagationSpeedMetersPerSecond: 299792458,
  independentRoundTripTimeSigmaSeconds: 1e-10,
} satisfies Input;
export const exampleOutput = {
  conditionalOneWayDistanceCm: 29979245800,
  conditionalRangeSigmaCm: 1.49896229,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/lunar-laser-ranging-precision-note-generator",
  title: "Lunar Laser Ranging Earth-Moon Distance cm Precision Note Generator",
  description:
    "Two-way laser-ranging½ctconversion and independent time-only range error; atmosphere/reflector/systematic clock corrections independently supplied, not actual Lunar Laser Ranging precision guarantee. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalOneWayDistanceCm",
      label: "Conditional one way distance cm",
      kind: "number",
    },
    {
      id: "conditionalRangeSigmaCm",
      label: "Conditional range sigma cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRoundTripSeconds: value.observedRoundTripSeconds as number,
      callerPathPropagationSpeedMetersPerSecond:
        value.callerPathPropagationSpeedMetersPerSecond as number,
      independentRoundTripTimeSigmaSeconds:
        value.independentRoundTripTimeSigmaSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
