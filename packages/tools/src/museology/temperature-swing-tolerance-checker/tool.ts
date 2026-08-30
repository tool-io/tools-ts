import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  ordered,
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly sampleHours: readonly number[];
  readonly temperatureC: readonly number[];
  readonly callerTemperatureCenterC: number;
  readonly callerHalfBandC: number;
}>;
export type Output = Readonly<{
  readonly observedDailyTemperatureRangeC: number;
  readonly piecewiseLinearDegreeHoursOutsideBand: number;
}>;
const inputFields = [
  { id: "sampleHours", label: "Sample hours", kind: "numberList" },
  { id: "temperatureC", label: "Temperature c", kind: "numberList" },
  {
    id: "callerTemperatureCenterC",
    label: "Caller temperature center c",
    kind: "number",
  },
  { id: "callerHalfBandC", label: "Caller half band c", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerHalfBandC, "callerHalfBandC");
  aligned(input.sampleHours, input.temperatureC, "sampleHours");
  ordered(input.sampleHours, "hours");
  if (input.sampleHours[0] !== 0 || input.sampleHours.at(-1)! !== 24)
    simpleError("day", "Complete caller 0–24h coverage required.");
  let dose = 0;
  for (let i = 1; i < input.sampleHours.length; i++) {
    const a = input.temperatureC[i - 1] - input.callerTemperatureCenterC,
      b = input.temperatureC[i] - input.callerTemperatureCenterC,
      dt = input.sampleHours[i] - input.sampleHours[i - 1];
    for (const sign of [-1, 1]) {
      const x = sign * a - input.callerHalfBandC,
        y = sign * b - input.callerHalfBandC;
      if (x >= 0 && y >= 0) dose += (dt * (x + y)) / 2;
      else if (x > 0 || y > 0) {
        const z = Math.max(x, y);
        dose += (dt * z * z) / (2 * Math.abs(y - x));
      }
    }
  }
  return {
    observedDailyTemperatureRangeC:
      maximum(input.temperatureC) - minimum(input.temperatureC),
    piecewiseLinearDegreeHoursOutsideBand: dose,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleHours: [0, 12, 24],
  temperatureC: [20, 24, 20],
  callerTemperatureCenterC: 20,
  callerHalfBandC: 1,
} satisfies Input;
export const exampleOutput = {
  observedDailyTemperatureRangeC: 4,
  piecewiseLinearDegreeHoursOutsideBand: 27,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/temperature-swing-tolerance-checker",
  title: "Temperature Daily Swing Tolerance Checker",
  description:
    "Integrate exact piecewise-linear daily temperature degree-hours outside caller center/band and retain measured swing; unlike RH range/slew, this is excursion magnitude×duration, not preservation safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDailyTemperatureRangeC",
      label: "Observed daily temperature range c",
      kind: "number",
    },
    {
      id: "piecewiseLinearDegreeHoursOutsideBand",
      label: "Piecewise linear degree hours outside band",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleHours: value.sampleHours as readonly number[],
      temperatureC: value.temperatureC as readonly number[],
      callerTemperatureCenterC: value.callerTemperatureCenterC as number,
      callerHalfBandC: value.callerHalfBandC as number,
    }),
});
export const run = tool.execute;
export default tool;
