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
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly calendarAgesBp: readonly number[];
  readonly curveRadiocarbonAgesBp: readonly number[];
  readonly measuredRadiocarbonAgeBp: number;
  readonly measurementSigmaYears: number;
  readonly sigmaMultiplier: number;
}>;
export type Output = Readonly<{
  readonly calendarAgeIntervalsBp: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "calendarAgesBp", label: "Calendar ages bp", kind: "numberList" },
  {
    id: "curveRadiocarbonAgesBp",
    label: "Curve radiocarbon ages bp",
    kind: "numberList",
  },
  {
    id: "measuredRadiocarbonAgeBp",
    label: "Measured radiocarbon age bp",
    kind: "number",
  },
  {
    id: "measurementSigmaYears",
    label: "Measurement sigma years",
    kind: "number",
  },
  { id: "sigmaMultiplier", label: "Sigma multiplier", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measurementSigmaYears, "measurementSigmaYears");
  positive(input.sigmaMultiplier, "sigmaMultiplier");
  aligned(input.calendarAgesBp, input.curveRadiocarbonAgesBp, "calendarAgesBp");
  ordered(input.calendarAgesBp, "calendarAgesBp");
  const low =
      input.measuredRadiocarbonAgeBp -
      input.sigmaMultiplier * input.measurementSigmaYears,
    high =
      input.measuredRadiocarbonAgeBp +
      input.sigmaMultiplier * input.measurementSigmaYears,
    calendarAgeIntervalsBp: number[][] = [];
  for (let i = 1; i < input.calendarAgesBp.length; i++) {
    const x0 = input.calendarAgesBp[i - 1],
      x1 = input.calendarAgesBp[i],
      y0 = input.curveRadiocarbonAgesBp[i - 1],
      y1 = input.curveRadiocarbonAgesBp[i];
    let a = 0,
      b = 1;
    if (y0 === y1) {
      if (y0 < low || y0 > high) continue;
    } else {
      const t0 = (low - y0) / (y1 - y0),
        t1 = (high - y0) / (y1 - y0);
      a = Math.max(0, Math.min(t0, t1));
      b = Math.min(1, Math.max(t0, t1));
      if (a > b) continue;
    }
    const l = x0 + (x1 - x0) * a,
      h = x0 + (x1 - x0) * b,
      last = calendarAgeIntervalsBp.at(-1);
    if (last && l <= last[1]) last[1] = Math.max(last[1], h);
    else calendarAgeIntervalsBp.push([l, h]);
  }
  if (!calendarAgeIntervalsBp.length)
    simpleError(
      "measurement",
      "No calibration-curve intersection in supplied domain.",
    );
  if (calendarAgeIntervalsBp.length > 128)
    simpleError("curve", "At most 128 disconnected intervals supported.");
  return { calendarAgeIntervalsBp };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  calendarAgesBp: [0, 100, 200, 300],
  curveRadiocarbonAgesBp: [0, 100, 0, 100],
  measuredRadiocarbonAgeBp: 50,
  measurementSigmaYears: 10,
  sigmaMultiplier: 1,
} satisfies Input;
export const exampleOutput = {
  calendarAgeIntervalsBp: [
    [40, 60],
    [140, 160],
    [240, 260],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/calibrated-age-intercept-range",
  title: "Calibrated Age Intercept Range",
  description:
    "Intersect a measured radiocarbon uncertainty band with a supplied piecewise-linear calibration curve, retaining disjoint intervals; not Bayesian calibration, curve uncertainty or an embedded IntCal lookup.",
  inputs: inputFields,
  outputs: [
    {
      id: "calendarAgeIntervalsBp",
      label: "Calendar age intervals bp",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      calendarAgesBp: value.calendarAgesBp as readonly number[],
      curveRadiocarbonAgesBp: value.curveRadiocarbonAgesBp as readonly number[],
      measuredRadiocarbonAgeBp: value.measuredRadiocarbonAgeBp as number,
      measurementSigmaYears: value.measurementSigmaYears as number,
      sigmaMultiplier: value.sigmaMultiplier as number,
    }),
});
export const run = tool.execute;
export default tool;
