import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedStrokeRatesPerMinute: readonly number[];
  readonly observedDistancePerStrokeMeters: readonly number[];
  readonly callerMinimumObservedSpeedMetersMinute: number;
}>;
export type Output = Readonly<{
  readonly modeledObservedSpeedsMetersMinute: readonly number[];
  readonly segmentsBelowCallerSpeedPolicy: readonly number[];
}>;
const inputFields = [
  {
    id: "observedStrokeRatesPerMinute",
    label: "Observed stroke rates per minute",
    kind: "numberList",
  },
  {
    id: "observedDistancePerStrokeMeters",
    label: "Observed distance per stroke meters",
    kind: "numberList",
  },
  {
    id: "callerMinimumObservedSpeedMetersMinute",
    label: "Caller minimum observed speed meters minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedStrokeRatesPerMinute.forEach((v) =>
    positive(v, "observedStrokeRatesPerMinute"),
  );
  input.observedDistancePerStrokeMeters.forEach((v) =>
    positive(v, "observedDistancePerStrokeMeters"),
  );
  nonnegative(
    input.callerMinimumObservedSpeedMetersMinute,
    "callerMinimumObservedSpeedMetersMinute",
  );
  aligned(
    input.observedStrokeRatesPerMinute,
    input.observedDistancePerStrokeMeters,
    "observedStrokeRatesPerMinute",
  );
  const speeds = input.observedStrokeRatesPerMinute.map(
    (v, i) => v * input.observedDistancePerStrokeMeters[i],
  );
  return {
    modeledObservedSpeedsMetersMinute: speeds,
    segmentsBelowCallerSpeedPolicy: speeds.flatMap((v, i) =>
      v < input.callerMinimumObservedSpeedMetersMinute ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStrokeRatesPerMinute: [20, 30],
  observedDistancePerStrokeMeters: [5, 4],
  callerMinimumObservedSpeedMetersMinute: 110,
} satisfies Input;
export const exampleOutput = {
  modeledObservedSpeedsMetersMinute: [100, 120],
  segmentsBelowCallerSpeedPolicy: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/rowing-stroke-rate-to-pace-checker",
  title: "Rowing Stroke Rate to Pace Checker",
  description:
    "Audit actual rowing stroke-rate and matched displacement-per-stroke observations against caller speed criterion; no assumed invariant stroke efficiency, drag model or rowing technique advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledObservedSpeedsMetersMinute",
      label: "Modeled observed speeds meters minute",
      kind: "numberList",
    },
    {
      id: "segmentsBelowCallerSpeedPolicy",
      label: "Segments below caller speed policy",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStrokeRatesPerMinute:
        value.observedStrokeRatesPerMinute as readonly number[],
      observedDistancePerStrokeMeters:
        value.observedDistancePerStrokeMeters as readonly number[],
      callerMinimumObservedSpeedMetersMinute:
        value.callerMinimumObservedSpeedMetersMinute as number,
    }),
});
export const run = tool.execute;
export default tool;
