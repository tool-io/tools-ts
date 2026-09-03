import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedOccupiedLightLux: readonly number[];
  readonly observedMatchedOccupiedHours: readonly number[];
  readonly callerDaylightThresholdLux: number;
}>;
export type Output = Readonly<{
  readonly occupiedDaylightAutonomyFraction: number;
}>;
const inputFields = [
  {
    id: "observedOccupiedLightLux",
    label: "Observed occupied light lux",
    kind: "numberList",
  },
  {
    id: "observedMatchedOccupiedHours",
    label: "Observed matched occupied hours",
    kind: "numberList",
  },
  {
    id: "callerDaylightThresholdLux",
    label: "Caller daylight threshold lux",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOccupiedLightLux.forEach((v) =>
    nonnegative(v, "observedOccupiedLightLux"),
  );
  input.observedMatchedOccupiedHours.forEach((v) =>
    nonnegative(v, "observedMatchedOccupiedHours"),
  );
  nonnegative(input.callerDaylightThresholdLux, "callerDaylightThresholdLux");
  aligned(
    input.observedOccupiedLightLux,
    input.observedMatchedOccupiedHours,
    "observedOccupiedLightLux",
  );
  const total = sum(input.observedMatchedOccupiedHours);
  positive(total, "occupied time");
  return {
    occupiedDaylightAutonomyFraction:
      sum(
        input.observedMatchedOccupiedHours.filter(
          (_, i) =>
            input.observedOccupiedLightLux[i] >=
            input.callerDaylightThresholdLux,
        ),
      ) / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOccupiedLightLux: [100, 300, 500],
  observedMatchedOccupiedHours: [1, 2, 1],
  callerDaylightThresholdLux: 300,
} satisfies Input;
export const exampleOutput = {
  occupiedDaylightAutonomyFraction: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/daylight-autonomy",
  title: "Daylight Autonomy Calculator",
  description:
    "Observed duration-weighted occupied threshold exceedance, inclusive equality, not daylight factor/instantaneous uniformity or annual extrapolation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "occupiedDaylightAutonomyFraction",
      label: "Occupied daylight autonomy fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOccupiedLightLux:
        value.observedOccupiedLightLux as readonly number[],
      observedMatchedOccupiedHours:
        value.observedMatchedOccupiedHours as readonly number[],
      callerDaylightThresholdLux: value.callerDaylightThresholdLux as number,
    }),
});
export const run = tool.execute;
export default tool;
